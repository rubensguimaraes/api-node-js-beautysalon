import multer from 'multer';
import crypto from 'crypto';
/** O extname retorna, com base no nome de uma imagem ou de um arquivo, a extensão do arquivo.
    O resolve nos permite percorrer um caminho dentro aplicação (o path.resolve) */
import { extname, resolve } from 'path';

export default {
  /** O storage refere-se a forma como o multer guardará os nossos arquivos de imagem
      As imagens serão armazenadas na pasta tmp, e para isto o multer utiliza o diskStorage */
  storage: multer.diskStorage({
    /** O destination refere-se ao destino dos nossos arquivos
        __dirname indica o diretório atual, o .. retorna até chegarmos na pasta tmp/uploads */
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    /** O filename receberá uma função que recerá 3 propriedades: rqe, file e cb (call back)
        O filename indica formatação do nome da imagem
        O nome do arquivo deverá possuir uma identificação (única), que entrará antes do nome.
        Para isto, utilizamos o crypto, que é uma biblioteca que já vem por padrão quem vem dentro do node
        utilizada para gerar caracteres aleatórios, além de outras coisas, e depois a função randomBytes
        que receberá o número de bytes que queremos gerar aleatórios e uma função que receberá o erro (err)
        ou uma resposta, caso ocorra sucesso. Caso jaja algum erro, será retornado o call back que é o 3o parâmero
        passando o erro. o call back (cb) é a função que devemos executar com o nome do arquivo ou com o erro
        caso tenha havido algum erro. Além disso, o req nos permite ter acesso a qualquer dado da requisição e o
        file refere-se a todos os dados do arquivo que o usuário está fazendo o upload (como o nome, o tipo
        (se é imagem), o tamanho, o formato, entre outras coisas). Csso não haja erro, retornaremos o call back (cb)
        com alguns parâmetros: null (considerando quando não houve erro), e no segundo parâmetro o nome da imagem). */
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
