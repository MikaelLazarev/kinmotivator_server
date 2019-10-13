import * as jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { decodedToken } from '../services/user';

export const authRequired = (req: any, res: any, next: any) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(403).json({
      error: 'Auth token is not valid',
    });
  }

  // Remove Bearer from string
  token = token.slice(7, token.length);

  if (token) {
    jwt.verify(token, config.SEED, (err: jwt.VerifyErrors, decoded: Object) => {
      if (err) {
        console.log("Token error", err);
        return res.status(403).json({
          error: 'Token is not valid',
        });
      } else {
        req.decoded = decoded;
        req.userID = (decoded as decodedToken).id;
        next();
      }
    });
  } else {
    console.log('No token in request');
    return res.status(403).json({
      error: 'Auth token is not supplied',
    });
  }
};


import {InvalidParamError, MissingParamError} from "../errors";
const {check, validationResult} = require('express-validator');

export function authValidator(req: any, res: any, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.errors[0];
    console.log(error)
    return res.status(400).json(error);
  }
  next();
}
// without decode check
export const authRequest = [
  check('username').isEmail().exists(),
  check('password').exists,
];

