import {ICommunity, ICommunityRepository, ICommunityService} from "../core/communities";
import { IFeedItem } from '../core/feed';


export class CommunityService implements ICommunityService {

    private store : ICommunityRepository;

    constructor(store: ICommunityRepository) {
        this.store = store

        this.create(<ICommunity>{
            title:"Run as your can",
            subtitle: "Yeap!",
            image: "https://dbslifestyle.s3.eu-central-1.amazonaws.com/sportBKG.jpg",
        }).then(() => console.log("Ok"))
    }

    create(ic : ICommunity) : Promise<ICommunity | null> {
        return this.store.create(ic)
    }

    join(id: string, userID: string): boolean {
        return false;
    }

    leave(id: string, userID: string): boolean {
        return false;
    }

    listAll(): Promise<ICommunity[]> {
        return this.store.find({}, {}, {})
    }

    listPersonal(userID: string): ICommunity[] {
        return [] as ICommunity[]
    }


    retrieve(id: string): Promise<ICommunity | null> {
        return this.store.findById(id);
    }

}

