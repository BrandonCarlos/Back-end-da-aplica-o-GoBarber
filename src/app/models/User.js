import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {//Esse parâmetro (sequelize) é a nossa conexão com a BASE DE DADOS
    super.init(//lá do arquivo "index.js"
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,//VIRTUAL = Um campo que nunca vai existir na base de dados
        //Ele vai existir somente aki no lado do código
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    //Agora o campo password(VIRTUAL) será preenchido, invez do password_hash
    this.addHook('beforeSave', async (user) => {
      if (user.password) {//Quando preencher password(VIRTUAL), um novo HASH será gerado
        //Só será gerado um novo HASH quando eu estiver informando um novo "password" para meu usuário
        //Aki dentro vamos gerar um novo "password_hash"
        user.password_hash = await bcrypt.hash(user.password, 8);//Estamos criptografando o password
        //do usuário
      }
    });

    return this;//return this; //dentro do "static init", sempre vou retornar o "model" que acabou
    //de ser inicializado aqui dentro
    //Vamos utilizar uma funcionalidade do "Sequelize" de HOOKS
    //HOOKS = São basicamente trechos de código que são executados de forma automática, baseado em açôes
    //que acontecem no nosso MODEL ex:
    //Antes de qualquer usuário ser salvo no banco de dados, tanto "criado", quanto "editado"
    //O trecho de código abaixo será executado de forma automática
    //Podemos utilizar vários HOOKS
    //beforeSave = esse trecho de código será executado antes de qualquer "save" em um usuário
    //Seja em "criação", seja em "edição", recebemos usuário como "parâmetro", e podemos fazer alteraçôes
    //nele
  }

  checkPassword(password) {//Criando novo método aki na classe para validação de senha
    //Parãmetro(password) password que o usuário ta tentando se autenticar
    return bcrypt.compare(password, this.password_hash);
    //compare = para comparar as duas "senhas"
    //Comparando a senha que o usuário acabou de colocar, com a senha que ele tem armazenado no
    //Banco de dados
    //compare irá retornar TRUE, se as senha baterem
    //compare irá retornar FALSE, se as senhas não baterem
  }
}

export default User;
