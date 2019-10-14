import { IFeedItem, IFeedRepository, IFeedService } from '../core/feed';
import { KinService } from './kin';
import { UserStore } from '../store/user';
import { UserService } from './user';
import { IUserService } from '../core/user';

export class FeedService implements IFeedService {
  private store: IFeedRepository;
  private kinService: KinService;
  private userService: IUserService;

  constructor(
    store: IFeedRepository,
    kinService: KinService,
    userService: IUserService,
  ) {
    this.store = store;
    this.kinService = kinService;
    this.userService = userService;
  }

  create(ic: IFeedItem): Promise<IFeedItem | null> {
      return new Promise<IFeedItem|null>(
        async(resolve, reject) => {
            try {
                const profile = await this.userService.getProfile(ic.authorID)
                ic.account = profile.address
                ic.author = profile.name + " " + profile.surname
                const result = await this.store.create(ic)
                resolve(result)
            }catch (e) {
                reject(e)

            }
        }
      )
  }

  join(id: string, userID: string): boolean {
    return false;
  }

  leave(id: string, userID: string): boolean {
    return false;
  }

  listAll(): Promise<IFeedItem[]> {
    return this.store.listAll();
  }

  listPersonal(userID: string): IFeedItem[] {
    return [] as IFeedItem[];
  }

  retrieve(id: string): Promise<IFeedItem | null> {
    return this.store.findById(id);
  }

  pay(id: string, userID: string, amount: number): Promise<IFeedItem[]> {
    return new Promise<IFeedItem[]>(async (resolve, reject) => {
      try {
        const feedItem = await this.store.findById(id);
        if (feedItem) {
          const user = await this.userService.getProfile(feedItem.id);
          if (user) {
            const result = await this.kinService.pay(
              user.address,
              amount,
              feedItem.title,
            );
            if (result) {
              const result = await this.store.incMoney(id, amount);
              console.log(result)
              resolve(this.listAll());
            }
          }
        }
      } catch (e) {}
    });

    return this.listAll();
  }
}
