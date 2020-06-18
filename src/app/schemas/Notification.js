import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    /* Conteúdo da notificação */
    content: {
      type: String,
      required: true,
    },
    /* Usuário que receberá a notificação.
       Como utilizamos o integer para o ID no SQL,
       aqui utilizaremos o Number */
    user: {
      type: Number,
      required: true,
    },
    /* Flag que irá definir se a notificação foi lida ou não.
       trabalharemos com um estilo parecido com o facebook,
       quando o usuário clicar na notificação, marcaremos como lida.
       Inicialmente definiremos como notificação não lida */
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    /* Para todos os registros definiremos como padrão o registro dos
    campos created_at e updated_at */
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);
