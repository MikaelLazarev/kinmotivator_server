import { Schema, model } from 'mongoose';
import { IUser, IUserRepository } from '../core/user';
import { RepositoryBase } from './base_repository';

export const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
}).set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export class UserStore extends RepositoryBase<IUser>
  implements IUserRepository {
  constructor() {
    super(model<IUser>('user', userSchema));
  }

  findByUserName(username: string): Promise<IUser | null> {
    return this._model.findOne({ username }).exec();
  }
}
