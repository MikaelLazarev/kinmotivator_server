import { Schema, model } from 'mongoose';
import { IFeedItem, IFeedRepository } from '../core/feed';
import { RepositoryBase } from './base_repository';

const feedSchema = new Schema({
  title: { type: String },
  subtitle: { type: String },
  image: { type: String },
  author: { type: String },
  authorID: { type: String },
  account: { type: String },
  kin: { type: Number },
  createdAt: { type: Date },
});

feedSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

feedSchema.pre('save', function(this: IFeedItem, next) {
  this.createdAt = new Date();
  next();
});

export class FeedStore extends RepositoryBase<IFeedItem>
  implements IFeedRepository {
  constructor() {
    super(model<IFeedItem>('Feed', feedSchema));
  }

  listAll(): Promise<IFeedItem[]> {
    return this._model.find({}, {}, {}).sort({createdAt: -1}).exec()
  }

  incMoney(id: String, amount: number): Promise<boolean> {
    return this._model.updateOne({ _id: id }, { $inc: { kin: amount } }).exec();
  }
}
