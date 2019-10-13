import { IAuthService } from '../core/user';

export class AuthController {
  public service: IAuthService;

  constructor(service: IAuthService) {
    this.service = service;
  }

  login() {
    return async (req: any, res: any) => {
      const username = req.body.username;
      const password = req.body.password;
      try {
        const tokenPair = await this.service.login(username, password);
        res.status(200).json(tokenPair);
      } catch (err) {
        console.log(err);
        res.status(403).json({ error: err.toString() });
      }
    };
  }

  signup() {
    return async (req: any, res: any) => {
      const username = req.body.username;
      const password = req.body.password;
      try {
        const tokenPair = await this.service.signup(username, password);
        res.status(201).json(tokenPair);
      } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.toString() });
      }
    };
  }

  refresh() {
    return async (req: any, res: any) => {
      const token = req.body.token;
      try {
        const tokenPair = await this.service.refreshToken(token);
        res.status(201).json(tokenPair);
      } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.toString() });
      }
    };
  }
}
