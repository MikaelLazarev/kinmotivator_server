import * as core from 'express-serve-static-core';
import { GlobalServices } from '../services/services';
import { communitiesRouter } from './communities';
import { authRouter } from './auth';
import { feedRouter } from './feed';
import * as express from 'express';
import { authRequired } from '../middlewares/auth';

export function apiRouter(): express.Router {
  const router = express.Router();
  const globalServices = new GlobalServices();
  router

    .use('/auth', authRouter(globalServices))
    .use('/communities', authRequired, communitiesRouter(globalServices))
    .use('/feed', authRequired, feedRouter(globalServices))

  return router;
}


