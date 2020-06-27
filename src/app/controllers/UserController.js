//Vamos começar com a validação de criação de usuário
import * as Yup from 'yup';
import User from '../models/User';//Importando o User.js


class UserController {
  async store(req, res) {

    //Vamos começar com as validaçôes
    const schema = Yup.object().shape({//Estou validando um "objeto", porque o "req.body" é um "objeto"
      //Aki vou passar o formato que eu quero que esse objeto tenha
      name: Yup.string().required(),//"name" é "string" e é obrigatório
      email: Yup.string().email().required(),//"email()" irá verificar se ele tem o @ tudo certinho, e campo
      //obrigatório também
      password: Yup.string().required().min(6),//.min(6) = A senha terá no minimo 6 digitos

    });

    //Verificando se bate com as regras que eu passei
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }


    //Definindo uma função para cadastro de usuários
    //Função store irá ter a mesma face de um MIDDLEWARE dentro do node
    //Essa função irá receber os dados do usuário, que iremos estar enviando pro INSOMNIA, depois
    //pro REACT, REACT NATIVE, os dados do usuário como nome, email, senha, e criar um novo registro
    //na base de dados POSTGRES
    //Esses dados irâo vir pelo req.body, de lá que vem os dados convertidos em JSON

    //Verificando se já tem um usuário com o mesmo email para cadastrar

    const UserExists = await User.findOne({ where: { email: req.body.email } });

    if (UserExists) {
      return res.status(400).json({ error: 'User already exists.' })//Se tiver um usuário com o mesmo email retornar ERRO 400
    }

    const { id, name, email, provider } = await User.create(req.body);//Iremos utilizar todos os dados que venham do nosso
    //req.body já vem dados convertidos para JSON
    //req.body
    //Quero que retorne no "insomnia" apenas os campos ( id, name, email, provider ), apenas esses campos
    //que iremos usar no FRONT-END (REACT, REACT NATIVE)

    return res.json({//Os campos que eu quero que retornem no INSOMNIA, serão os campos que usaremos
      id,//no FRONT-END
      name,
      email,
      provider,
    });
  }

  async update(req, res) {//Atualizar dados não faz sentido para usuários que não estão "logados"

    //Vamos começar com as validaçôes
    const schema = Yup.object().shape({//Estou validando um "objeto", porque o "req.body" é um "objeto"
      //Aki vou passar o formato que eu quero que esse objeto tenha
      name: Yup.string(),//"name" é "string" e é obrigatório
      email: Yup.string().email(),//"email()" irá verificar se ele tem o @ tudo certinho, e campo
      //obrigatório também
      oldPassword: Yup.string().min(6),//.min(6) = A senha terá no minimo 6 digitos
      //Se o usuário informar a senha antiga dele, ele precisa informar a senha nova
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field//Se a "oldPassword" estiver preenchida, eu quero que a "field" sejá
        //required (obrigatório), "field" se refere ao "password" nova senha, senão
        //retorno o "field da forma que já estava"
      ),//Validação condicional, quando "oldPassword"
      //for preenchida eu quero que a "password" também seja preenchida, senão não
      //Confirmação da nova "password"
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field//Se o "password" estiver preenchido, o confirmePassword vai ser
        //obrigatório, e ele precisa ser igual ao "password", se não eu retorno o "field" da mesma forma
      ),//Yup.ref('password'), se referindo a outro campo no caso "password"

    });

    //Verificando se bate com as regras que eu passei
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;//Vou buscar o "email e oldPassword" de dentro do req.body

    const user = await User.findByPk(req.userId);//Buscar usuário dentro do banco de dados que está
    //querendo ser editado (buscando atrávez do "id")

    if (email != user.email) {//O email que está querendo alterar se for diferente do email que já tem

      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' })//Se tiver um usuário com o mesmo email retornar ERRO 400
      }

    }

    //Outra verificação que devemos fazer é se o "oldPassword" bate com a senha que ele já tem
    //Quero que essa verificação seja feita somente se o usuário estiver tentando editar a senha dele
    //Por que pode ser o usuário queria apenas editar o nome, email etc..
    //Só vou fazer a verificação se a senha dele bate, se ele informou a senha antiga dele
    //quer dizer que ele tá querendo alterar a senha dele
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    //Se tudo deu certo eu vou atualizar o usuário
    //Passando todas as informações que eu quero alterar
    //Eu não quero retornar todos os dados pro FRONT-END apenas alguns como "id, name, email, provider"
    //Atualizando o usuário
    const { id, name, provider } = await user.update(req.body);//As informações estão dentro de req.body(corpo da requisição)


    return res.json({//Os campos que eu quero que retornem no INSOMNIA, serão os campos que usaremos
      id,//no FRONT-END
      name,
      email,
      provider,
    });
  }

}

export default new UserController();//Criando uma INSTÂNCIA da class "UserController" e exportando
