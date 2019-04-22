import * as mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

userSchema.pre<User & mongoose.Document>('findOneAndUpdate', function updateDate(next) {
  this.update({}, {
    $set: { updatedAt: new Date() },
  });
  next();
});

export default userModel;
