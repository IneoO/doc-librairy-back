import * as process from 'process';
import express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import bluebird from 'bluebird';
import mongoose from 'mongoose';
import logger from './util/logger';
import { MONGODB_URI } from './util/secrets';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env' });

// Controllers (route handlers)

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true }).catch((err) => {
  logger.info(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
  process.exit();
});

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * API routes.
 */
app.get('/', (request, response) => {
  response.send('Hello world!');
});
/**
* OAuth authentication routes. (Sign in)
*/

export default app;
