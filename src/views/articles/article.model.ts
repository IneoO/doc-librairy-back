import * as mongoose from 'mongoose';
import Article from './article.interface';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, required: true },
    type: {
      type: {
        type: String,
        enum: [
          'article',
          'book',
          'video',
          'podcast',
          'study',
          'other',
        ],
      },
    },
    url: { type: String, required: true },
    tags: [{ type: String }],
    posterEmail: { type: String },
    nbClick: { type: Number, default: 0 },
    valid: { type: Boolean, required: true },
    validedBy: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

const articleModel = mongoose.model<Article & mongoose.Document>('Article', articleSchema);

articleSchema.pre<Article & mongoose.Document>('findOneAndUpdate', function updateDate(next) {
  this.update({}, {
    $set: { updatedAt: new Date() },
  });
  next();
});

articleSchema.pre<Article & mongoose.Document>('findById', function updateCount(next) {
  this.update({}, {
    $inc: {
      nbClick: 1,
    },
  });
  next();
});

export default articleModel;
