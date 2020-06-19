// Sequelize - responsável pela conexão com o banco PostgresSQL
import Sequelize from 'sequelize';
// Mongoose - responsável pela conexão com o banco MongoDB
import mongoose from 'mongoose';

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
    this.mongo();
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

  mongo() {
    // Faz a conexão com o banco de dados
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/beautysalon',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
