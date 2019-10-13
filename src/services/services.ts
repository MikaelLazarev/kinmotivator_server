import { CommunityService } from './communities';
import { ICommunityService } from '../core/communities';
import { GlobalStore } from '../store/store';
import { IAuthService } from '../core/user';
import { AuthService } from './user';
import { IFeedService } from '../core/feed';
import { FeedService } from './feed';

export class GlobalServices {
  private globalStore: GlobalStore;
  public authService: IAuthService;
  public communityService: ICommunityService;
  public feedService : IFeedService;

  constructor() {
    this.globalStore = new GlobalStore();
    this.communityService = new CommunityService(
      this.globalStore.communityStore,
    );
    this.authService = new AuthService(this.globalStore.userStore);
    this.feedService = new FeedService(this.globalStore.feedStore);
    console.log(this.communityService);
  }
}
