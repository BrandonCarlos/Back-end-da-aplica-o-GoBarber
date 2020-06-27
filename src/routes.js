// Aki ficará todas as nossas ROTAS
import { Router } from 'express'; // IMPORTANDO DO EXPRESS "Router"
//import User from './app/models/User';//Importando o User.js
import UserController from './app/controllers/UserController';//Importando o arquivo "UserController.js"
// Separar o ROTEAMENTO(server.get, server.post, server.put, server.delete)
// do EXPRESS em outro ARQUIVO
// iMPORTAR APENAS O "ROUTER" e não o EXPRESS INTEIRO
// ROUTER possui o get. post, put, delete
//Precisamos importar o "SessionController"
import SessionController from './app/controllers/SessionController';
//Vamos importar o "middleware"
import authMiddleware from './app/middlewares/auth';

const routes = new Router();//Lá no Routes.js podemos criar rotas, e como instânciammos uma  nova ROTA
//Podemos criar rotas do tipo GET, POST, PUT, DELETE

//Vamos tentar criar um usuário aki dentro
/*routes.get('/', async (req, res) => {
  const user = await User.create({//Na "rota", estou criando um novo Usuario(User)
    name: 'Brandon Carlos',//E vai mandar estes dados lá pro BANCO DE DADOS - POSTGRES - POSTBIRD
    email: 'gfdgfd@gmail.com',
    password_hash: '1435345645765',
  });

  return res.json(user);//Retornando pro FRONT-END os dados name, email, password_hash
});*/

//Vamos criar um novo usuário
routes.post('/users', UserController.store);//Chamando o método "store" - (Criação de usuário)
//da classe UserController, o método "store", que está pegando todos os dados do req.body

//Vamos definir a "rota" que vai acessar o "sessionController"
routes.post('/sessions', SessionController.store);

//Definindo como "middleware" global
//As rotas acima não passaram por este "middleware"
routes.use(authMiddleware);//Este comando só irá valer para as linhas abaixo

//Vamos criar a rota de UPDATE
routes.put('/users', UserController.update);//Evitar que o usuário acesse está rota, se não
//estiver autenticado(logado)


// Exportando ROTAS
export default routes;//Exportando está mandando essa ROTA pro (routes.js), criando ROTA
