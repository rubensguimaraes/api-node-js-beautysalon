// Sequelize - responsável pela conexão com o banco
import Sequelize from 'sequelize';

// Importação dos models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

// Configurações do nosso banco
import databaseConfig from '../config/database';

// Array com todos os models da aplicação
const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Faz a conexão com o banco de dados
    this.connection = new Sequelize(databaseConfig);

    // Percorre o array com todos os models
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
