import {ICommunity, ICommunityRepository, ICommunityService} from "../core/communities";
import { IFeedItem } from '../core/feed';


export class CommunityService implements ICommunityService {

    private store : ICommunityRepository;

    constructor(store: ICommunityRepository) {
        this.store = store


//         this.create(<ICommunity>{
//             title:"I love Running Club",
//             subtitle: "Yeap!",
//             image: "https://kinmotivator.s3.eu-north-1.amazonaws.com/run.jpg",
//             description: `Support
//
// Joining the goats took away all the pressures of competing in club championships and leagues and allowed me to just run and be part of a wider, friendly and inspiring community. I love everything we stand for and it’s nice to turn up to events and meet and support fellow goats.
// Rebecca Gardiner
//
// Inspire Some exciting news!
//
// have just become a member of my first running club.  I now belong to Lonely Goat RC and can not be more excited. the community online seem ace and i love the ethos behind the club.
//
// Bring it on!
//
// Steve Collins Achieve
//
// Being part of the Lonely Goat RC has had such a positive impact on my running.
//
// This hugely diverse community of like-minded runners support and inspires each and every member, whatever their ability and aspirations. I wear my LG top with pride!
// Maureen Lucas`
//         }).then(() => console.log("Ok"))
        //
        // this.create(<ICommunity>{
        //     title:"Eco food is a key for your healh",
        //     subtitle: "Yeap!",
        //     image: "https://kinmotivator.s3.eu-north-1.amazonaws.com/ecofood.jpg",
        // }).then(() => console.log("Ok"))
        //
        // this.create(<ICommunity>{
        //     title:"Learn blockhain and become the best developer",
        //     subtitle: "Yeap!",
        //     image: "https://kinmotivator.s3.eu-north-1.amazonaws.com/blockchain.jpg",
        // }).then(() => console.log("Ok"))
        //
        // this.create(<ICommunity>{
        //     title:"Upgrade your carrer in 40s!",
        //     subtitle: "Yeap!",
        //     image: "https://kinmotivator.s3.eu-north-1.amazonaws.com/study-notebooks.jpg",
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

