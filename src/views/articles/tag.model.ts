import * as mongoose from 'mongoose';
import Tag from './tag.interface';

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

const tagModel = mongoose.model<Tag & mongoose.Document>('Tag', tagSchema);

tagSchema.pre('findOneAndUpdate', function updateDate(next) {
  this.update({}, {
    $set: { updatedAt: new Date() },
  });
  next();
});

export default tagModel;
