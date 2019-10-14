import { ILike, ILikeService } from '../core/likes';

export class ActivityController {
  public service: ILikeService;

  constructor(service: ILikeService) {
    this.service = service;
  }

  create() {
    return async (req: any, res: any) => {
      const userId = req.userID;

      const like = <ILike> {
        receiver: req.body.receiver,
        senderID: userId,
        memo: req.body.memo,
        amount: req.body.amount,
        feed_id: req.body.feed_id,
        tx_id: req.body.tx_id
      }

      try {
        const activityUpdated = await this.service.create(like);
        res.json( activityUpdated);
      } catch (err) {
        console.log(err)
        res.status(400).json({ error: err });
      }
    };
  }

  list() {
    return async(req: any, res: any) => {
      try {
        const userId = req.userID;
        const result = await this.service.listPersonal(userId)
        console.log("REEE", result)
        res.json(result);
      } catch (err) {
        console.log(err)
        res.status(400).json({ error: err });
      }
    };
  }
}
