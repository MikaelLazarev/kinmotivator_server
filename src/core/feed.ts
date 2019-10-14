import { Document } from 'mongoose';
import { IBaseRepository } from './repository';

export interface IFeedItem extends Document {
  id: string;
  communityID: string;
  title: string;
  subtitle: string;
  image: string;
  author: string;
  authorID: string;
  account: string;
  kin: number;
  createdAt: object;
}

export interface IFeedRepository extends IBaseRepository<IFeedItem> {
  incMoney(id: String, amount: number) : Promise<boolean>
  listAll(): Promise<IFeedItem[]>
}

export interface IFeedService {
  create(ic: IFeedItem): Promise<IFeedItem | null>;
  retrieve(id: string): Promise<IFeedItem | null>;
  listAll(): Promise<IFeedItem[]>;
  listPersonal(userID: string): IFeedItem[];
  join(id: string, userID: string): boolean;
  leave(id: string, userID: string): boolean;
  pay(id: string, userID: string, amount: number) : Promise<IFeedItem[]>;
}
