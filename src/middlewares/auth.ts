import * as jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export const authRequired = (req: any, res: any, next: any) => {
  console.log(req.headers)

  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (!token || !token.startsWith('Bearer ')) {
    return res.json({
      error: 'Token is not valid',
    });
  }

  // Remove Bearer from string
  token = token.slice(7, token.length);

  if (token) {
    jwt.verify(token, config.SEED, (err: jwt.VerifyErrors, decoded: Object) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid',
        });
      } else {
        req.decoded = decoded;
        console.log(decoded)
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied',
    });
  }
};
