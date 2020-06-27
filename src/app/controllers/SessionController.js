import jwt from 'jsonwebtoken'//Já instalamos atráves do "prompt" o "jsonwebtoken"
//yarn add jsonwebtoken, <-- esse cara aki que vai gerar o nosso TOKEN JWT
import * as Yup from 'yup';
import User from '../models/User';//Importando o User.js
//Iremos importar o "authConfig" de "auth.js"
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({//Estou validando um "objeto", porque o "req.body" é um "objeto"
      //Aki vou passar o formato que eu quero que esse objeto tenha
      //"name" é "string" e é obrigatório
      email: Yup.string().email().required(),//"email()" irá verificar se ele tem o @ tudo certinho, e campo
      //obrigatório também
      password: Yup.string().required(),//.min(6) = A senha terá no minimo 6 digitos

    });

    //Verificando se bate com as regras que eu passei
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    //Método "store", para criação da minha "sessão"
    const { email, password } = req.body //Pegando o email, password que eu recebo do body(corpo da requisição)
    //Quando o usuário for se autenticar na nossa aplicação ele precisará informar o "email, senha"
    //Vamos validar se existe um usuário com esse "email", senão existir o usuário ta tentando acessar
    //com "email" que nem existe

    const user = await User.findOne({ where: { email } });

    if (!user) {//Verificando se o usuário não existe
      return res.status(401).json({ error: 'User not found' });
      //401 = Não autorizado, não deu certo a autenticação
    }

    //Verificar se está batendo as duas "senhas"
    if (!(await user.checkPassword(password))) {//Verificando se a senha não ta batendo
      return res.status(401).json({ error: 'Password does not match' });//As senhas não batem
    }

    //Se o email do usuário foi encontrado, e a senha dele bateu
    const { id, name } = user;//Pegando o "id, name" do usuário, que é o que eu quero retornar apartir
    //do momento que ele fizer "login" na minha aplicação

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),//Mais um váriavel "token", para gerar o "token, vou utilizar o "jwt"
      //Como parâmetro do "token" iremos enviar o "payload", = informaçôes adicionais do usuário
      //2° parâmetro é um "texto", "STRING", que somente os desenvolvedor podem ter "acesso"
      //3° parãmetro = algumas configurações para esse "token", todo "token jwt", tem uma data
      //de expiração, "token" não é infinito, porque se deixarmos infinito uma vez que o usuário
      //tenha o "token" da nossa aplicação ele fará o que quiser com esse token pro tempo que ele quiser
      //por isso vamos definir uma data de expiração para o "token"
    });



    //Também temos que fazer a validação se a senha bate, se a senha não bater significa que o usuário
    //colocou a senha errada
    //Validação da senha, precisaremos do "bcrypt", iremos fazer a verificação de senha no "model"
    //User.js


  }
}

export default new SessionController();
