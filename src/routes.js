import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router(); // a variável routes representa o Router que importamos do express
const upload = multer(multerConfig);

// O método utilizado será o Post, e a regra para inclusão do registro
// está na classe UserController do arquivo UserController.js método store
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Aqui chamamos o meddleware (pasta middlewares\auth.js) que fará a verificação do token
// Se não for executado o next em auth.js a aplicação não prosseguirá para a próxima rota
// que é a a rota da linha 21, onde é feita a alteração dos dados.
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;