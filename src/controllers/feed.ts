import { IFeedItem, IFeedService } from '../core/feed';

export class FeedController {

    public service : IFeedService

    constructor(service : IFeedService) {
        this.service = service
    }

    create()  {
        return (req: any, res: any) => {
            const newItem = <IFeedItem>{
                title : req.body.title,
                subtitle : req.body.subtitle,
                image : req.body.image,
                author : req.body.author,
                authorAccount : req.body.authorAccount,
            }
            this.service.create(newItem)
                .then(result => res.json(result))
                .catch(() => res.status(400).send())
        }
    }

    list()  {
        return (req: any, res: any) => {
            this.service.listAll()
                .then(result => {
                    console.log(result)
                    res.json(result)
                })
                .catch(() => res.status(400).send())
        }
    }

    retrieve()  {
        return (req: any, res: any) => {
            const id = req.params.id || "0";
            this.service.retrieve(id)
                .then(result => res.json(result))
                .catch(() => res.status(400).send())
        }
    }

    join()  {
        return (req: any, res: any) => {
            console.log("KKK", this.service)
            const id = "444"
            const userId = "444"
            return res.json(this.service.join(id, userId))
        }
    }

}
