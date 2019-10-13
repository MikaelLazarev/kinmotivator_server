import { Schema, model } from 'mongoose';
import { IFeedItem } from '../core/feed';
import { RepositoryBase } from './base_repository';
import { ICommunity } from '../core/communities';

export const profileSchema = new Schema({

});

profileSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
  },
});


