import { IUserService, IProfile, IUser, IUserRepository } from '../core/user';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ITokenPair } from '../core/user';
import { config } from '../config/environment';
import { KinService } from './kin';
import { CommunityService } from './communities';
import { ICommunityService } from '../core/communities';

export interface decodedToken {
  id: string;
  exp: number;
}

export class UserService implements IUserService {
  private store: IUserRepository;
  private kinService: KinService;
  private communityService: ICommunityService;

  constructor(
    store: IUserRepository,
    kinService: KinService,
    communityService: ICommunityService,
  ) {
    this.store = store;
    this.kinService = kinService;
    this.communityService = communityService;
  }

  login(email: string, password: string): Promise<ITokenPair> {
    console.log(email, password);
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.store.findByUserName(email);
        if (user) {
          const isLoginCorrect = await bcrypt.compare(password, user.password);
          if (isLoginCorrect) {
            resolve(this.generateTokenPair(user.id));
          } else {
            throw new Error('User not found or wrong password');
          }
        } else {
          throw new Error('User not found or wrong password');
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  signup(email: string, password: string): Promise<ITokenPair> {
    console.log(email, password);
    return new Promise((resolve, reject) => {
      this.store
        .findByUserName(email)
        .then(result => {
          console.log(result);
          if (result) {
            reject('User already exists');
          } else {
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(password, salt);
            this.store
              .create(<IUser>{
                username: email,
                password: passwordHash,
              })
              .then(item => {
                if (item && item.id) {
                  resolve(this.generateTokenPair(item.id));
                }
              })
              .catch(() => reject('Cant create user in database'));
          }
        })
        .catch(() => {
          reject('DB Error');
        });
    });
  }

  generateTokenPair(userID: string): ITokenPair {
    const user = {
      id: userID,
    };
    const access_token = jwt.sign(user, config.SEED, {
      expiresIn: config.TOKEN_LIFE,
    });
    const refresh_token = jwt.sign(user, config.SEED, {
      expiresIn: config.REFRESH_TOKEN_LIFE,
    });

    console.log(access_token, refresh_token);
    return <ITokenPair>{
      access_token,
      refresh_token,
    };
  }

  refreshToken(token: string): Promise<ITokenPair> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        config.SEED,
        (err: jwt.VerifyErrors, decoded: Object) => {
          if (err) {
            reject('Token is not valid');
          }
          try {
            const { id, exp } = decoded as decodedToken;
            const now = new Date();
            if (exp < Math.round(now.getTime() / 1000)) {
              reject('Token is outdated');
            }
            resolve(this.generateTokenPair(id));
          } catch (e) {
            reject(e.toString());
          }
        },
      );
    });
  }

  getProfile(id: string): Promise<IProfile> {
    return new Promise<IProfile>(async (resolve, reject) => {
      try {
        const user = await this.store.findById(id);
        const fee = await this.kinService.client.getMinimumFee();
        if (user) {

          const balance = user.address
            ? await this.kinService.getBalance(user.address)
            : 0;

          const communities = await this.communityService.listPersonal(id)
          console.log(communities)

          resolve(<IProfile>{
            id: 'user', // for compartability with IOS App
            name: user.name,
            surname: user.surname,
            image: user.image,
            address: user.address,
            profile_done:
              user.profile_done === undefined ? false : user.profile_done,
            balance: balance,
            communities: communities,
            fee: fee,
          });
        } else {
          reject('User not found');
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  updateProfile(id: string, profile: IProfile): Promise<IProfile> {
    return new Promise<IProfile>(async (resolve, reject) => {
      try {
        const address = profile.address;
        const transation_id = await this.kinService.createAccount(address);
        console.log(transation_id);
        const result = await this.store.updateProfile(id, profile);
        if (result) {
          const profile = await this.getProfile(id);
          resolve(profile);
        } else {
          reject('Cant update profile');
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
