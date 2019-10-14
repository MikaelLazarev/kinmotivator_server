import { ICommunityRepository } from '../core/communities';
import { IUserRepository } from '../core/user';
import { CommunityStore } from './communities';
import { UserStore } from './user';
import { IFeedRepository } from '../core/feed';
import { FeedStore } from './feed';
import { ILikeStore } from '../core/likes';
import { LikesStore } from './likes';

export class GlobalStore {
  public communityStore: ICommunityRepository;
  public userStore: IUserRepository;
  public feedStore: IFeedRepository;
  public likesStore: ILikeStore

  constructor() {
    this.communityStore = new CommunityStore();
    this.userStore = new UserStore();
    this.feedStore = new FeedStore();
    this.likesStore = new LikesStore();

  }
}
