import * as express from 'express';

const loggerMiddleware = (request: express.Request, response: express.Response, next) => {
  console.info(`${new Date().toISOString()} - ${request.method} ${request.path}`);
  next();
};

export default loggerMiddleware;
