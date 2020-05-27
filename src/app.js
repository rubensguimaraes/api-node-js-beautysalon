import express from 'express'; // Variável para representar o servidor (mudamos a syntaxe).
import cors from 'cors'; // Permitirá que todas as aplicações front-end poderão acessar a aplicação.
import path from 'path'; // Importamos o path do node, para podermos passar o caminho até a pasta de uploads.
import routes from './routes'; // Variável para representar as rotas (mudamos a syntaxe).

import './database'; // Importação das classes da pasta database, que por exemplo, importa os models

class App {
  constructor() {
    // Construtor, é chamado automaticamente quando instanciamos a classe, quando a classe é chamada.
    // Obs.: Esta classe será chamada somente uma vez
    this.server = express();

    this.server.use(cors()); // Com isto todas as aplicações front-end poderão acessar a aplicação.

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // Nosso servidor trabalhará com JSON
    /* Definimos a rota files que vai servir aos arquivos estáticos, no caso /files (método GET).
       Como parâmetro do método express.static passamos o path (importado acima) .resolve,
       o nome do diretório (até o diretório do app.js(este arquivo)), voltamos um diretório (..),
       tmp/uploads */
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      return next();
    });
    this.server.use(routes);
  }
}

export default new App().server; // Exporta ums instância do App (mudamos a syntaxe)
