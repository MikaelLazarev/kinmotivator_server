import * as core from 'express-serve-static-core';
import { GlobalServices } from '../services/services';
import { communitiesRouter } from './communities';
import { authRouter } from './auth';
import { feedRouter } from './feed';
import { profileRouter } from './profile';
import * as express from 'express';
import { authRequired } from '../middlewares/auth';
import { KinAccount, KinClient } from '@kinecosystem/kin-sdk-node';
import { kinRouter } from './kin';

export function apiRouter(client: KinClient, account: KinAccount): express.Router {
  const router = express.Router();
  const globalServices = new GlobalServices(client, account);
  router

    .use('/auth', authRouter(globalServices))
    .use('/communities', authRequired, communitiesRouter(globalServices))
    .use('/feed', authRequired, feedRouter(globalServices))
    .use('/profile', authRequired, profileRouter(globalServices))
    .use('/kin', kinRouter(client, account))


  return router;
}


