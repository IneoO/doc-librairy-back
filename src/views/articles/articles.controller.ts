import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import authMiddleware from '../../middleware/auth.middleware';
import ArticleNotFoundException from '../../exceptions/ArticleNotFoundException';
import Article from './article.interface';
import ArticleQuery from './articleQuery.interface';
import Pagination from '../../interfaces/pagination.interface';
import articleModel from './article.model';
import tagModel from './tag.model';
import sourceModel from './source.model';
import CreateArticleDto from './article.dto';

class ArticlesController implements Controller {
  public path = '/article';
  public router = express.Router();
  private article = articleModel;
  private tag = tagModel;
  private source = sourceModel;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}s`, this.getAllArticles);
    this.router.get(`${this.path}/:id`, this.getArticleById);
    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreateArticleDto, true),
      this.modifyArticle,
    );
    this.router.put(
      `${this.path}/:id/valid`,
      authMiddleware,
      validationMiddleware(CreateArticleDto, true),
      this.validArticle,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteArticle);
    this.router.post(this.path, validationMiddleware(CreateArticleDto), this.createArticle);
  }

  private getAllArticles = (request: express.Request, response: express.Response) => {
    const query: ArticleQuery = {};
    if (request.query.tags) {
      const tags = request.query.tags.split(',');
      query.tags = { $in: tags };
    }
    if (request.query.sources) {
      const sources = request.query.sources.split(',');
      query.source = { $in: sources };
    }
    if (request.query.search) {
      query.name = { $regex: request.query.search, $options: 'i' };
      query.description = { $regex: request.query.search, $options: 'i' };
    }
    const pagination: Pagination = {};
    if (request.query.limit) {
      pagination.limit = parseInt(request.query.limit, 10);
    }
    if (request.query.skip) {
      pagination.skip = parseInt(request.query.skip, 10);
    }
    this.article.find(query, {}, pagination).then(articles => {
      response.send(articles);
    });
  }

  private getArticleById = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id = request.params.id;
    this.article.findById(id)
      .then(article => {
        if (article) {
          response.send(article);
        } else {
          next(new ArticleNotFoundException(id));
        }
      });
  }

  private modifyArticle = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id = request.params.id;
    const articleData: Article = request.body;
    this.article.findByIdAndUpdate(id, articleData, { new: true })
      .then(article => {
        if (article) {
          response.send(article);
        } else {
          next(new ArticleNotFoundException(id));
        }
      });
  }

  private validArticle = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const id = request.params.id;
    const article = await this.article.findById(id);
    if (!article.valid) {
      article.valid = true;
      article.validedBy = request.user.username;
      const articleModified = await this.article.findByIdAndUpdate(id, article, { new: true });
      if (article) {
        response.send(article);
        article.tags.forEach(tag =>
          this.createOrUpdateTag(tag),
        );
        this.createOrUpdateSource(article.source);
      } else {
        next(new ArticleNotFoundException(id));
      }
    } else {
      response.send(article);
    }
  }

  private createOrUpdateTag = (tag: string) => {
    this.tag.update(
      { name: tag },
      {
        $inc: { count: 1 },
        $set: { name: tag },
      },
      {
        upsert: true,
      },
    );
  }

  private createOrUpdateSource = (source: string) => {
    this.source.update(
      { name: source },
      {
        $inc: { count: 1 },
        $set: { name: source },
      },
      {
        upsert: true,
      },
    );
  }

  private deleteArticle = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    this.article.findByIdAndDelete(id)
      .then(successResponse => {
        if (successResponse) {
          response.send(200);
        } else {
          response.send(new ArticleNotFoundException(id));
        }
      });
  }

  private createArticle = (request: express.Request, response: express.Response) => {
    const articleData: Article = request.body;
    const createdArticle = new this.article(articleData);
    createdArticle.valid = false;
    createdArticle.save()
      .then(savedArticle => {
        response.send(savedArticle);
      });
  }
}

export default ArticlesController;
