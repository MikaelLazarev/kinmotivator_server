import { Schema, model } from 'mongoose';
import { IProfile, IUser, IUserRepository } from '../core/user';
import { RepositoryBase } from './base_repository';
import { profileSchema } from './profile';

export const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  name: { type: String },
  surname: { type: String },
  address: { type: String },
  image: { type: String, default: 'https://kinmotivator.s3.eu-north-1.amazonaws.com/user.png' },
  done: { type: Boolean, default: true }
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

    return this._model.findOne({ username }).exec()
  }

  updateProfile(id: string, profile: IProfile): Promise<boolean> {
    return new Promise<boolean>(async(resolve, reject) => {
      console.log(id, profile)
      try {
        const result = await this._model.updateOne( {"_id": this.toObjectId(id)}, { $set: profile }, {upsert: true, useFindAndModify: true}).exec()
        console.log("MONGO OOO", result)
        resolve(true)
      } catch (e) {
        reject(e)
      }
      }
    )
  }


}
