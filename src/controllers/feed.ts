import { IFeedItem, IFeedService } from '../core/feed';
const uuidv4 = require('uuid/v4');

export class FeedController {
  public service: IFeedService;

  constructor(service: IFeedService) {
    this.service = service;
  }

  create() {
    return (req: any, res: any) => {
      console.log('Upload hanlder');
      try {
        if (!req.files) {
          res.status(400).send({
            error: 'No file uploaded',
          });
        } else {
          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
          let photo = req.files.photo;

          console.log('BDYDYD', req.body);

          const name = uuidv4() + '.jpeg';
          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          photo.mv('./uploads/' + name);

          //send response

          const newItem = <IFeedItem>{
            title: req.body.title,
            subtitle: req.body.subtitle,
            image: 'http://localhost:3000/images/' + name,
            communityID: req.body.communityID,
            authorID: req.userID,
            kin: 0,
          };
          this.service
            .create(newItem)
            .then(result => res.json(result))
            .catch(() => res.status(400).send());
        }
      } catch (err) {
        res.status(500).send(err);
      }

      //
      //
    };
  }

  list() {
    return (req: any, res: any) => {
      this.service
        .listAll()
        .then(result => {
          console.log(result);
          res.json(result);
        })
        .catch(() => res.status(400).send());
    };
  }

  retrieve() {
    return (req: any, res: any) => {
      const id = req.params.id || '0';
      this.service
        .retrieve(id)
        .then(result => res.json(result))
        .catch(() => res.status(400).send());
    };
  }

  pay() {
    return async (req: any, res: any) => {
      const userId = req.userID;
      const id = req.params.id || '0';
      const amount = req.body.amount || 0;
      try {
        const feedUpdated = await this.service.pay(id, userId, amount);
        res.json(feedUpdated);
      } catch (err) {
        res.status(400).json({ error: err });
      }
    };
  }
}
