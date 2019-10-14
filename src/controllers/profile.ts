import { IUserService, IProfile } from '../core/user';

export class ProfileController {
  public service: IUserService;

  constructor(service: IUserService) {
    this.service = service;
  }

  getProfile() {
    return async (req: any, res: any) => {
      const userId = req.userID;
      try {
        const profile = await this.service.getProfile(userId);
        console.log(profile)
        res.status(200).json(profile);
      } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.toString() });
      }
    };
  }

  updateProfile() {
    return async (req: any, res: any) => {
      const userId = req.userID;

      const newProfile = <IProfile>{
        name: req.body.name,
        surname: req.body.surname,
        address: req.body.address,
        profile_done: true
      }

      try {
        const profile = await this.service.updateProfile(userId, newProfile);
        console.log(profile)
        res.status(200).json(profile);
      } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.toString() });
      }
    };
  }
}
