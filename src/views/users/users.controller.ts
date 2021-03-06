import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import User from './user.interface';
import userModel from './user.model';

class UsersController implements Controller {
  public path = '/user';
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}s`, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.patch(`${this.path}/:id`, this.modifyUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
    this.router.post(this.path, this.createUser);
  }

  private getAllUsers = (request: express.Request, response: express.Response) => {
    this.user.find().then(users => {
      response.send(users);
    });
  }

  private getUserById = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    this.user.findById(id)
      .then(user => {
        response.send(user);
      });
  }

  private modifyUser = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    const userData: User = request.body;
    this.user.findByIdAndUpdate(id, userData, { new: true })
      .then(user => {
        response.send(user);
      });
  }

  private deleteUser = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    this.user.findByIdAndDelete(id)
      .then(successResponse => {
        if (successResponse) {
          response.send(200);
        } else {
          response.send(404);
        }
      });
  }

  private createUser = (request: express.Request, response: express.Response) => {
    const userData: User = request.body;
    const createdUser = new this.user(userData);
    createdUser.save()
      .then(savedUser => {
        response.send(savedUser);
      });
  }
}

export default UsersController;
