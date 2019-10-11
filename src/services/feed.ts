import { IFeedItem, IFeedRepository, IFeedService } from '../core/feed';


export class FeedService implements IFeedService {

    private store : IFeedRepository;

    constructor(store: IFeedRepository) {
        this.store = store

        this.create(<IFeedItem>{
            title:"10K steps and marathon done",
            subtitle: "Yeap!",
            image: "https://dbslifestyle.s3.eu-central-1.amazonaws.com/sportBKG.jpg",
            author: "Mike Lazarev",


        }).then(() => console.log("Ok"))
    }

    create(ic: IFeedItem) : Promise<IFeedItem | null> {
        return this.store.create(ic)
    }

    join(id: string, userID: string): boolean {
        return false;
    }

    leave(id: string, userID: string): boolean {
        return false;
    }

    listAll(): Promise<IFeedItem[]> {
        return this.store.find({}, {}, {})
    }

    listPersonal(userID: string): IFeedItem[] {
        return [] as IFeedItem[]
    }


    retrieve(id: string): Promise<IFeedItem | null> {
        return this.store.findById(id);
    }

}

