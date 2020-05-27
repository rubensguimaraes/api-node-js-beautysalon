import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    // Este método será chamado automaticamente pelo sequelize
    // super representa a classe pai, que é o Model que extendeu a classe User
    super.init(
      // 1o parâmetro do método init
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        // Este campo nunca será VIRTUAL nunca será utilizado no banco
        // somente aqui no model
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      // 2o parâmetro do método init
      {
        sequelize,
      }
    );

    // Hook são trechos de código que são executados de forma automática
    // com base em ações que ocorrem no model.
    // No exemplo abaixo, antes de haver qualquer alteração na tabale de usuarios
    // seja inclusão, edição ou exclusão, o trecho de código abaixo será executado.
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        // 8 indica o peso da criptografia do bcrypt
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    // Retorno do model que foi inicializado nesta classe
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
