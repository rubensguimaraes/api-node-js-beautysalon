import User from '../models/User';
import File from '../models/File';

/* Importamos o User pois o provider é um usuário */
class ProviderController {
  /* Método para a listagem */
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(providers);
  }
}

export default new ProviderController();
