import { Schema, model } from 'mongoose';
import { IFeedItem } from '../core/feed';
import { RepositoryBase } from './base_repository';

const feedSchema = new Schema({
  title: { type: String },
  subtitle: { type: String },
  image: { type: String },
  author: { type: String },
  authorAccount: { type: String },
});

feedSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export class FeedStore extends RepositoryBase<IFeedItem> {
  constructor() {
    super(model<IFeedItem>('Feed', feedSchema));
  }
}
