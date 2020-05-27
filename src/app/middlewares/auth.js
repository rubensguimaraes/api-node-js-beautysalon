// O objetivo deste middleware é buscar o token
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

// Aqui exportamos o nosso middleware, que é uma função com 3 parâmetros
// O 3o parâmetro (next) irá indicar se a aplicação deverá prosseguir ou não
export default async (req, res, next) => {
  // Aqui buscamos o Header enviado pelo insomnia
  const authHeader = req.headers.authorization;

  // Caso o token não seja encontrado, retorna mensagem
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Token não fornecido na requisição!' });
  }

  // O authHeader.split(' ') abaixo retorna um array com duas posições.
  // como authHeader retorna: Bearer + espaço + String do token, o split eliminará o espaço
  // sobrando o Bearer (1a posição do vetor) e a String do token (2a posição do token)
  // Como nos interessa apenas a 2a posição do array, utilizamos const [, token],
  // dessa forma somente a variável token receberá o conteúdo atribuído (no caso a String)
  const [, token] = authHeader.split(' ');

  try {
    // O decoded receberá o retorno do jwt.verify
    // o await executará duas funções: promisify(jwt.verify) e (token, authConfig.secret)
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // Caso o resultado do processamento da linha acima seja satisfatório,
    // o decoded receberá os valores retornados pela requisição (enviada pelo insomnia)
    req.userId = decoded.id;
    // Se chegou até aqui no next(), prosseguiremos com o código, permitindo a execução da próxima
    // rota definida após a rota do middleware ('/sessions') que é a rota (put('/users'))
    // que promoverá a alteração dos dados.
    return next();
  } catch (err) {
    // Caso o retorno seja um erro, significa que o token é inválido
    return res.status(401).json({ error: 'Token invalido!' });
  }
};
