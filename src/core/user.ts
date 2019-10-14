import { Document } from 'mongoose';
import { IBaseRepository } from './repository';
import { ICommunity } from './communities';

export interface ITokenPair {
  access_token: string;
  refresh_token: string;
}


export interface IProfile extends Document {
  id: string;
  name: string;
  surname: string;
  address: string;
  image: string;
  communities: ICommunity[];
  profile_done: boolean;
  balance: number;
  fee: number;
}

export interface IUser extends Document {
  id: string;
  username: string;
  password: string;
  profile_done: boolean;
  name: string;
  surname: string;
  address: string;
  image: string;
}

export interface IUserRepository extends IBaseRepository<IUser> {
  findByUserName(username: string): Promise<IUser | null>;
  updateProfile(id: string, profile : IProfile) : Promise<boolean>;
}

export interface IUserService {
  login(email: string, password: string): Promise<ITokenPair>;
  signup(email: string, password: string): Promise<ITokenPair>;
  refreshToken(token: string): Promise<ITokenPair>;
  getProfile(id: string): Promise<IProfile>;
  updateProfile(id: string, profile: IProfile) : Promise<IProfile>;
}
