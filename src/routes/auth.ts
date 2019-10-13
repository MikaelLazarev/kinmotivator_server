import * as core from 'express-serve-static-core';
import { CommunityController } from '../controllers/communities';
import { GlobalServices } from '../services/services';
import { AuthController } from '../controllers/auth';
import { authRequest, authValidator} from '../middlewares/auth';
import { Router } from 'express';
import * as express from 'express'

export function authRouter(
  globalServices: GlobalServices,
): Router {
  const router = express.Router();
  const authController = new AuthController(globalServices.authService);
  router
    .post('/login',  authController.login())
    .post('/signup',  authController.signup())
    .post('/refresh', authController.refresh());
  return router;
}
