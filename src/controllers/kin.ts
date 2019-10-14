import { IFeedItem, IFeedService } from '../core/feed';
import { KinService } from '../services/kin';

export class KinController {
  public service: KinService;

  constructor(service: KinService) {
    this.service = service;
  }

  pay() {
    return async (req: any, res: any) => {

      console.log(req.body)
      const envelope = req.body.envelope || '';
      const networkId = req.body.networkId || '';

      try {
        const tx_envelope = await this.service.pay(envelope, networkId);
        res.json({ tx_envelope: tx_envelope });
      } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
      }
    };
  }
}
