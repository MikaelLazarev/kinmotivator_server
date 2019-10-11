import { ICommunityService } from "../core/communities";

export class ProfileController {

    public service : ICommunityService

    constructor(service : ICommunityService) {
        this.service = service
    }

    create()  {
        return (req: any, res: any) => {
            this.service.create()
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
