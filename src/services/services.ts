import { CommunityService } from './communities';
import { ICommunityService } from '../core/communities';
import { GlobalStore } from '../store/store';
import { IUserService } from '../core/user';
import { UserService } from './user';
import { IFeedService } from '../core/feed';
import { FeedService } from './feed';
import { KinAccount, KinClient } from '@kinecosystem/kin-sdk-node';
import { KinService } from './kin';
import { ILikeService } from '../core/likes';
import { LikesService } from './likes';
import { AWSService } from './aws';

export class GlobalServices {
  private globalStore: GlobalStore;
  public userService: IUserService;
  public communityService: ICommunityService;
  public feedService: IFeedService;
  public kinService: KinService;
  public likesService: ILikeService;
  public awsService : AWSService;

  constructor(client: KinClient, account: KinAccount) {
    this.globalStore = new GlobalStore();
    this.awsService = new AWSService("kinmotivator");

    this.communityService = new CommunityService(
      this.globalStore.communityStore,
    );

    this.kinService = new KinService(client, account);
    this.userService = new UserService(
      this.globalStore.userStore,
      this.kinService,
      this.communityService,
    );

    this.feedService = new FeedService(
      this.globalStore.feedStore,
      this.kinService,
      this.userService,
      this.awsService,
    );

    this.likesService = new LikesService(this.globalStore.likesStore, this.userService, this.feedService);
  }
}
