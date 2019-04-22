import { Request } from 'express';
import User from '../views/users/user.interface';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
