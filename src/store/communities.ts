import { Schema, model } from 'mongoose';
import { ICommunity, ICommunityRepository } from '../core/communities';
import { RepositoryBase } from './base_repository';

const communitySchema = new Schema({
  title: { type: String },
  subtitle: { type: String },
  image: { type: String },
  description: { type: String },
  ownerId: { type: String },
  members: { type: Map }
});

communitySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export class CommunityStore extends RepositoryBase<ICommunity> implements ICommunityRepository {
  constructor() {
    super(model<ICommunity>('Community', communitySchema));
  }

  join(id: string, userID: string): Promise<boolean> {
    const map = "members." + userID
    return new Promise((resolve, reject) => {
      this._model.updateOne({_id : id }, { $set : { [map]: true }})
        .exec()
        .then(result => {
          if (result.ok === 1) {
            resolve(true)
          } else
            reject("cant update community in DB")
        })

    })
  }

  leave(id: string, userID: string): Promise<boolean> {
    const map = "members." + userID
    return new Promise((resolve, reject) => {
      this._model.updateOne({_id : id }, { $unset : { [map] : "" }})
        .exec()
        .then(result => {
          if (result.ok === 1) {
            resolve(true)
          } else
            reject("cant update community in DB")
        })

    })
  }

  listPersonal(userID: string): Promise<ICommunity[]> {
    const item = "members." + userID
    return this._model.find({[item]: {$exists: true }}).exec()
  }



}
