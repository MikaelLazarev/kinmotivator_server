import { Schema, model } from 'mongoose';
import { ICommunity } from '../core/communities';
import { RepositoryBase } from './base_repository';

const communitySchema = new Schema({
  title: { type: String },
  subtitle: { type: String },
  image: { type: String },
  description: { type: String },
  ownerId: { type: String },
});

communitySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export class CommunityStore extends RepositoryBase<ICommunity> {
  constructor() {
    super(model<ICommunity>('Community', communitySchema));
  }
}
