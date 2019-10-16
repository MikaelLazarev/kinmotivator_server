import { IFeedItem, IFeedService } from '../core/feed';
import { ILike } from '../core/likes';


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

          const newItem = <IFeedItem>{
            title: req.body.title,
            subtitle: req.body.subtitle,
            // image: 'https://kinmotivator.herokuapp.com/images/' + name,
            communityID: req.body.communityID,
            authorID: req.userID,
            kin: 0,
          };
          this.service
            .create(newItem, req.files.photo.data)
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


}
