import {ICommunity, ICommunityRepository, ICommunityService} from "../core/communities";
import { IFeedItem } from '../core/feed';


export class CommunityService implements ICommunityService {

    private store : ICommunityRepository;

    constructor(store: ICommunityRepository) {
        this.store = store

        // this.create(<ICommunity>{
        //     title:"Run as your can",
        //     subtitle: "Yeap!",
        //     image: "https://dbslifestyle.s3.eu-central-1.amazonaws.com/sportBKG.jpg",
        // }).then(() => console.log("Ok"))
    }

    create(ic : ICommunity) : Promise<ICommunity | null> {
        return this.store.create(ic)
    }

    join(id: string, userID: string): Promise<ICommunity | null> {
        return new Promise<ICommunity|null>((resolve, reject) => {
              this.store.join(id, userID)
                .then(() => resolve(this.retrieve(id, userID)))
                .catch(() => reject("Cant join community"))
          }
        )
    }

    leave(id: string, userID: string): Promise<ICommunity | null> {
        return new Promise<ICommunity|null>((resolve, reject) => {
              this.store.leave(id, userID)
                .then(() => resolve(this.retrieve(id, userID)))
                .catch(() => reject("Cant join community"))
          }
        )
    }

    listAll(): Promise<ICommunity[]> {
        return this.store.find({}, {}, {})
    }

    listPersonal(userID: string): Promise<ICommunity[]> {
        return this.store.listPersonal(userID)
    }


    retrieve(id: string, userID: string): Promise<ICommunity | null> {
        return new Promise<ICommunity|null>((resolve, reject) => {
            this.store.findById(id)
              .then(result => {
                  if (!result) { reject("Nothing was found")}
                  else {

                      const members = result.members as Map<string, string>

                      const clearedResult = <ICommunity>{
                          id: result._id,
                          title: result.title,
                          subtitle: result.subtitle,
                          image: result.image,
                          description: result.description,
                          is_member: result.members ? (members.get(userID) ? true : false) : false
                      }

                      console.log(clearedResult)
                      resolve(clearedResult)
                  }


              })
              .catch(e => reject(e))
        })
    }

}

