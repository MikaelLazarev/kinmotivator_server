import { ICommunity, ICommunityService } from '../core/communities';

export class CommunityController {

    public service : ICommunityService

    constructor(service : ICommunityService) {
        this.service = service
    }

    create()  {
        return (req: any, res: any) => {
            const newItem = <ICommunity>{
                title : req.body.title,
                subtitle : req.body.subtitle,
                image : req.body.image,
            }
            this.service.create(newItem)
                .then(result => res.json(result))
                .catch(() => res.status(400).send())
        }
    }

    list()  {
        return (req: any, res: any) => {
            this.service.listAll()
                .then(result => res.json(result))
                .catch(() => res.status(400).send())
        }
    }

    retrieve()  {
        return async (req: any, res: any) => {
            const userId = req.userID
            const id = req.params.id || "0";
            try {
                const result = await this.service.retrieve(id, userId)
                res.json(result)
            } catch (e) {
                res.status(400).json({error : e.toString()})
            }

        }
    }

    join()  {
        return (req: any, res: any) => {

            const id = req.params.id
            const userId = req.userID

            if ((!id) || (!userId)) {
                return res.status(400).json({error : "Wrong request"})
            }
            this.service.join(id, userId)
              .then(result => res.json(result))
              .catch(() => res.status(400).send())
        }
    }

    leave()  {
        return (req: any, res: any) => {
            const id = req.params.id
            const userId = req.userID

            if ((!id) || (!userId)) {
                return res.status(400).json({error : "Wrong request"})
            }
            this.service.leave(id, userId)
              .then(result => res.json(result))
              .catch(() => res.status(400).send())
        }
    }

}
