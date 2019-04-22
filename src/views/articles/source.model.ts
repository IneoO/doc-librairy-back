import * as mongoose from 'mongoose';
import Source from './source.interface';

const sourceSchema = new mongoose.Schema(
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

const sourceModel = mongoose.model<Source & mongoose.Document>('Source', sourceSchema);

sourceSchema.pre('findOneAndUpdate', function updateDate(next) {
  this.update({}, {
    $set: { updatedAt: new Date() },
  });
  next();
});

export default sourceModel;
