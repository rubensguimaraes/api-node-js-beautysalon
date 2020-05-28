// Importamos tudo o que existe denyto do yup a atribui a variável Yup,
// ele será resppnsável pelas validações
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';
import File from '../models/File';

class SessionController {
  async store(req, res) {
    // Validações por meio do Yup.
    // Validamos um objeto, pois o req.body é um objeto.
    // Em seguida, informamos o formato que exigiremos que o objeto possua.
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    // Efetuamos a validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação!' });
    }
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado!' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha inválida!' });
    }

    const { id, name, avatar, provider } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      // No 1o parâmetro do método sign informamos o payload (informações adicionais
      // que desejamos adicionar ao token), vamos considerar o id do usuário.
      // O 2o parâmetro deve ser um texto exclusivo (para obter este texto utilizaremos o md5,
      // veja na apostila como obtê-lo).
      // O 3o parâmetro será uma data de expiração, iremos colocar 7 dias.
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
