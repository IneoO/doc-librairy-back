import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

const errorMiddleware = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const type = status < 500 ? 'warn' : 'error';
  console.log(request);
  console.log(response);
  console[type](
    `${new Date().toISOString()} - ${request.method} ${request.path}` +
    ` - ${status} => ${message}`);
  response
    .status(status)
    .send({
      status,
      message,
    });
};

export default errorMiddleware;
