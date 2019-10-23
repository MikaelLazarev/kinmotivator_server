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
  const Sentry = require('@sentry/node');
  Sentry.init({ dsn: 'https://00cd46908aed4167aa4ab9b51426e82b@sentry.io/1792215' });
  app.use(Sentry.Handlers.requestHandler());
  const client = getKinClient(config);
  const account = await getKinAccount(client, config);

  try {
    var db = mongoose.connection;

    db.on('connecting', function() {
      console.log('connecting to MongoDB...');
    });

    db.on('error', async function(error: any) {
      console.error('12Error in MongoDb connection: ' + error);
      await mongoose.disconnect();
    });
    db.on('connected', function() {
      console.log('MongoDB connected!');
    });
    db.once('open', function() {
      console.log('MongoDB connection opened!');
    });
    db.on('reconnected', function () {
      console.log('MongoDB reconnected!');
    });
    db.on('disconnected', async function() {
      console.log('MongoDB disconnected!');
      await mongoose.connect(config.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoReconnect:true,
      });
    });
    await mongoose.connect(config.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoReconnect:true,
    });
  } catch (e) {
    console.log('Error to connect to MongoDB', e);
  }

  // enable files upload
  app.use(
    fileUpload({
      createParentPath: true,
    }),
  );

  const pathToStatic = (process.env.TARGET === 'HEROKU') ? '/app/src/landing' : __dirname + '/landing';
  app.use('/', express.static(pathToStatic));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  express_logger.initializeLogger(app, null, consoleConf);
  logger = express_logger.getLogger();
  app.use(morgan(MORGAN_LOG_LEVEL, { stream: logger.stream }));
  app.use('/api', apiRouter(client, account));
  app.use(Sentry.Handlers.errorHandler());
  app.use(notFoundHandler); // catch 404
  app.use(generalErrorHandler); // catch errors
  return app;
}
