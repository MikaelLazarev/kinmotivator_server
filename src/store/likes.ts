import { Schema, model } from 'mongoose';
import { ILike, ILikeStore } from '../core/likes';
import { RepositoryBase } from './base_repository';

const likesSchema = new Schema({
  receiver: { type: String },
  memo:  { type: String },
  amount:  { type: Number},
  senderID: { type: String },
  sender:  { type: String },
  feed_id:  { type: String },
  tx_id:  { type: String },

});

likesSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export class LikesStore extends RepositoryBase<ILike> implements ILikeStore {
  constructor() {
    super(model<ILike>('likes', likesSchema));
  }


  listPersonal(userID: string): Promise<ILike[]> {
    return this._model.find({ userID }).exec()
  }
}
