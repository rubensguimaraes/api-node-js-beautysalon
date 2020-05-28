// Importamos tudo o que existe dentro do yup e atribuimos a variável Yup,
// ele será resppnsável pelas validações
import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';

class UserController {
  // Possui a mesma característica de um midleware
  // Este método store será chamado no arquivo routes.js
  async store(req, res) {
    // Validações por meio do Yup.
    // Validamos um objeto, pois o req.body é um objeto.
    // Em seguida, informamos o formato que exigiremos que o objeto possua.
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // Efetuamos a validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação!' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Email já existente!' });
    }
    // Recebe os dados, inicialmente pelo método post definido no insomnia
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // Validações por meio do Yup.
    // Validamos um objeto, pois o req.body é um objeto.
    // Em seguida, informamos o formato que exigiremos que o objeto possua.
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        // o when é uma validação condicional, no caso, em cima da variável oldPassword,
        // quando ela for preenchida o password será obrigatório.
        // O 2o parâmetro do when é uma função
        // No nosso exemplo, o field refere-se ao campo password
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      // Quando o campo password for informado, teremos que ter um campo
      // confirmPassword com o mesmo valor, para garantirmos a digitação correta
      // da nova senha
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // Efetuamos a validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação!' });
    }
    // Obtendo o novo email e email atual do corpo da requisição
    const { email, oldPassword } = req.body;
    // Buscamos no banco de dados o usuário a ser editado
    const { userId } = req;
    const user = await User.findByPk(userId);

    // Só será permitida a alteração, caso o novo email seja diferente
    // do email existente na tabela do Banco de Dados
    // A validação comentada acima somente será efetuada se um novo email
    // for informado. Pois o usuário, talvez queira alterar outros dados
    // diferente do email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });

      if (emailExists) {
        return res.status(400).json({ error: 'Email já existente!' });
      }
    }

    // Verifico se a senha informada como atual no corpo da requisição
    // é, de fato, igual a senha na tabela do banco de dados
    // A validação comentada acima somente será efetuada se a senha atual
    // for informada. Pois o usuário, talvez queira alterar outros dados
    // diferente da senha
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha atual não confere!' });
    }

    // Passadas as condições anteriores, o usuário será atualizado
    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    // Retornamos os dados a seguir para o insomnia
    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new UserController();
