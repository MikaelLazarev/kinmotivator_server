import { IAuthService } from '../core/user';

export class AuthController {
  public service: IAuthService;

  constructor(service: IAuthService) {
    this.service = service;
  }

  login() {
    return (req: any, res: any) => {
      const username = req.body.username;
      const password = req.body.password;
      console.log(username, password)
      this.service
        .login(username, password)
        .then(result => res.status(200).json(result))
        .catch(err => {
          console.log(err);
          res.status(403).json({ error: err.toString() });
        });
    };
  }

  signup() {
    return (req: any, res: any) => {
      const username = req.body.username;
      const password = req.body.password;
      this.service.signup(username, password)
        .then(result => res.status(201).json(result))
        .catch(err => {
          console.log(err);
          res.status(403).json({ error: err.toString() });
        });
    };
  }

  refresh() {
    return (req: any, res: any) => {
      const token = req.body.token;
      this.service.refreshToken(token)
        .then(result => res.status(201).json(result))
        .catch(err => {
          console.log(err);
          res.status(403).json({ error: err.toString() });
        });
    };
  }
}
