import App from './app';
import UsersController from './views/users/users.controller';
import ArticlesController from './views/articles/articles.controller';

const app = new App(
  [
    new UsersController(),
    new ArticlesController(),
  ]);

app.listen();
