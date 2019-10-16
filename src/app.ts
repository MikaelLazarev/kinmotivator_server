import { getKinAccount, getKinClient } from './init';
import 'express-async-errors'; // handle async/await errors in middleware
import { ConfigParams, MORGAN_LOG_LEVEL } from './config/environment';
import { consoleConf } from './config/logger';
import { generalErrorHandler, notFoundHandler } from './middlewares/_old';
import * as core from 'express-serve-static-core';
import { apiRouter } from './routes/api';
import * as path from 'path';

const express = require('express');

const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const express_logger = require('express-logger-unique-req-id');
const mongoose = require('mongoose');

const compression = require('compression');
export let logger: any;

export async function createApp(config: ConfigParams): Promise<core.Express> {
  const app = express();
  const client = getKinClient(config);
  const account = await getKinAccount(client, config);

  try {
    await mongoose.connect(config.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log('Error to connect to MongoDB', e);
  }

  // const db = mongoose.connection;
  // db.on('error', console.error.bind(console, 'connection error:'));
  // db.once('open', function() {
  console.log('Connected to DB');
  // we're connected!

  // enable files upload
  app.use(
    fileUpload({
      createParentPath: true,
    }),
  );

  console.log(path.join(__dirname, '/static'))
  app.use('/', express.static('/app/src/static'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  express_logger.initializeLogger(app, null, consoleConf);
  logger = express_logger.getLogger();
  app.use(morgan(MORGAN_LOG_LEVEL, { stream: logger.stream }));
  app.use('/api', apiRouter(client, account));
  app.use(notFoundHandler); // catch 404
  app.use(generalErrorHandler); // catch errors
  return app;
}
