import { IAuthService, IUser, IUserRepository } from '../core/user';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ITokenPair } from '../core/user';
import { config } from '../config/environment';

interface decodedToken {
  id: string;
  exp: number;
}

export class AuthService implements IAuthService {
  private store: IUserRepository;

  constructor(store: IUserRepository) {
    this.store = store;
  }

  login(email: string, password: string): Promise<ITokenPair> {
    return new Promise((resolve, reject) =>
      this.store.findByUserName(email).then(result => {
        if (!result) {
          reject('User not found');
        } else {
          bcrypt
            .compare(password, result.password)
            .then(compareResult => {
              if (compareResult) {
                resolve(this.generateTokenPair(result.id));
              }
            })
            .catch(() => reject('Wrong password'));
        }
      }),
    );
  }

  signup(email: string, password: string): Promise<ITokenPair> {
    console.log(email, password);
    return new Promise((resolve, reject) => {
      this.store
        .findByUserName(email)
        .then(result => {
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
    console.log(token)
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
            const now = new Date()
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


}
