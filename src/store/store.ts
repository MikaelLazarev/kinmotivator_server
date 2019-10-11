import { ICommunityRepository } from '../core/communities';
import { IUserRepository } from '../core/user';
import { CommunityStore } from './communities';
import { UserStore } from './user';
import { IFeedRepository } from '../core/feed';
import { FeedStore } from './feed';

export class GlobalStore {
  public communityStore: ICommunityRepository;
  public userStore: IUserRepository;
  public feedStore: IFeedRepository;

  constructor() {
    this.communityStore = new CommunityStore();
    this.userStore = new UserStore();
    this.feedStore = new FeedStore();

  }
}
