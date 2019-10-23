import {ICommunity, ICommunityRepository, ICommunityService} from "../core/communities";
import { IFeedItem } from '../core/feed';


export class CommunityService implements ICommunityService {

    private store : ICommunityRepository;

    constructor(store: ICommunityRepository) {
        this.store = store


//         this.create(<ICommunity>{
//             title:"I love Running Club Saint-Petersburg",
//             subtitle: "Yeap!",
//             image: "https://kinmotivator.s3.eu-north-1.amazonaws.com/run.jpg",
//             description: `I LOVE SUPERSPORT is the world's largest cycling school. We teach adults running, swimming, cycling, skiing and triathlon in fifty-four cities and nine countries of the world - Russia, Estonia, Latvia, the United Arab Emirates, Ukraine, Belarus, Kazakhstan, Israel, and Kyrgyzstan. We unite people with the love of sport and a healthy lifestyle and show by our example that sport is a good habit that takes life to a new level.
//
// Our dream is to involve 2% of the inhabitants of Russia in sports. There is a theory: if only 2% of society changes for the better, the majority will gradually catch up, and after the majority, the daily reality of our country will also change.
//
// We create for each student a comfortable environment for positive changes. He trains, meets people close in spirit, sets ambitious goals and achieves results - he feels better, overcomes the distance, receives a medal at the finish and is proud of what he did.
//
// In addition to face-to-face and online training, we conduct inspirational meetings, master classes, lectures and webinars. Every month we meet at brisk breakfasts not as athletes, but as ordinary people. We support each other in closed chats, accompany them to travel starts, celebrate victories at champions' dinners. We remain friends after the release.
//
// We change lives through sports.`
//         }).then(() => console.log("Ok"))
//
//         this.create(<ICommunity>{
//             title:"Eco food is a key for your health",
//             subtitle: "Organic food community",
//             image: "https://kinmotivator.s3.eu-north-1.amazonaws.com/ecofood.jpg",
//         description: `Maybe you are health-conscious and want to eat clean, healthy food – maybe you are a keen organic grower and committed food campaigner; either way, you are part of the same broader organic food community. If you are passionate about wholesome, organic or biodynamic food, seed-saving, food sovereignty, fighting back against the pesticide industry and their media lobbyists, or any number of related food issues then you are part of a wide ‘community of interest‘ – a group of people with a common passion for food issues. This community of Interest includes:
//
// organic, biodynamic, wholesome and small-scale/grass-roots food producers;
// local/sustainable economy champions – especially those interested in the Transition Town movement;
// seed-savers/swappers, (natural) vegetable breeders and growers/protectors of heirloom crop varieties – all of whom take an interest in open-pollinated seeds;
// anti-GMO and anti-pesticide campaigners and activists;
// ‘foodies’ and gourmands who value taste and nutrition – especially fans of the Slow Food movement (the antidote to fast-food junk!);
// food sovereignty and peasant-justice campaigners and activists;
// wildlife/environment enthusiasts, protectors and campaigners;
// people interested in Permaculture;
// and perhaps most importantly, organic food consumers – those who understand how the industrial food system is contributing to human disease and a host of other problems, and who take a stand by buying/eating organic (and similar) food whenever possible – voting with your wallet (and encouraging others to do so) is one of the most effective things you can do in a predominantly consumer culture!
// There are a lot of people and organisations out there making a stand about these things (although maybe not always in a ‘joined-up’ way!). Links to a selection of these organisations can be found on the slide-show below, with a more comprehensive list of country-specific links found towards the bottom of this page.
//
//         `
//         }).then(() => console.log("Ok"))
//
//         this.create(<ICommunity>{
//             title:"Learn blockhain and become the best developer",
//             subtitle: "St. Petersburg BlockChain Community",
//             image: "https://kinmotivator.s3.eu-north-1.amazonaws.com/blockchain.jpg",
//             description: `St. Petersburg BlockChain Community Meetup intended to figure out a core of blockchain developers based in the city and having plans to work here
//
// Our contacts:
//
// https://www.facebook.com/spblockchain
//
// https://youtube.com/SPbBlockChainCommunity
//
// https://t.me/spblockchain
//             `
//         }).then(() => console.log("Ok"))
//
//         this.create(<ICommunity>{
//             title:"Upgrade your carrier in 40s!",
//             subtitle: "Yeap!",
//             image: "https://kinmotivator.s3.eu-north-1.amazonaws.com/study-notebooks.jpg",
//             description: `Making a career switch is no easy decision, especially when considering the change at 40 or older. You might be wondering which careers are really worth going back to school for at this stage in your career and if the time (and money) spent seeking a degree or certification is worth the payoff.
//
// Luckily, there are several fields worth the mid-career return to school whether income, job security, happiness, or fulfillment at work is your focus for making the switch.
//
// To help you get started, we’ve rounded up 17 careers across 6 fields with help from the Bureau of Labor Statistics that are absolutely worth the investment of returning to school.`
//         }).then(() => console.log("Ok, updated"))
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

