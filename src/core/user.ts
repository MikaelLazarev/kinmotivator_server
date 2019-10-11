import { Document } from 'mongoose';
import { IBaseRepository } from './repository';

export interface ITokenPair {
  access_token: string;
  refresh_token: string;
}

export interface IUser extends Document {
  id: string;
  username: string;
  password: string;
}

export interface IUserRepository extends IBaseRepository<IUser> {
  findByUserName(username: string) : Promise<IUser | null>
}

export interface IAuthService {
  login(email: string, password: string) :  Promise<ITokenPair>;
  signup(email: string, password: string) : Promise<ITokenPair>;
  refreshToken(token: string) : Promise<ITokenPair>;
}
