import { ILike, ILikeStore, ILikeService } from '../core/likes';
import { IUserService } from '../core/user';
import { IFeedService } from '../core/feed';

export class LikesService implements ILikeService {
  private store: ILikeStore;
  private userService: IUserService;
  private feedService: IFeedService;

  constructor(
    store: ILikeStore,
    userService: IUserService,
    feedService: IFeedService,
  ) {
    this.store = store;
    this.userService = userService;
    this.feedService = feedService;
  }

  create(ic: ILike): Promise<ILike | null> {
    return new Promise<ILike | null>(async (resolve, reject) => {
      try {
        const sender = await this.userService.getProfile(ic.senderID);
        ic.sender = sender.name + ' ' + sender.surname;
        const result = await this.store.create(ic);
        const update = await this.feedService.pay(ic.feed_id, ic.amount)
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  listPersonal(userID: string): Promise<ILike[]> {
    return this.store.listPersonal(userID);
  }
}
