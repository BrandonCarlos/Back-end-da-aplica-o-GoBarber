import Sequelize from 'sequelize';//Importando Sequelize de 'sequelize', que irá fazer a conexão com o banco de dados
import User from '../app/models/User';//Importando os MODELS(User.js) aki dentro, pois lá no arquivo
//User.js possui um parâmetro(sequelize) bom esse (sequelize) será a váriavel "connection"
//e isso gera com que CARREGUE NOSSOS MODELS
//Se tivesse mais MODELS teriamos que importar também
import databaseConfig from '../config/database';//Importando as configurações do banco de dados

const models = [User];//Array com todos os MODELS da minha aplicação, por enquanto só tem o User.js

class Database {
  constructor() {
    this.init();
  }

  init() {//Método "init" que irá fazer a conexão com a base de dados, e carregar nossos MODELS
    this.connection = new Sequelize(databaseConfig);//Sequelize vem do IMPORT da linha 1
    //A váriavel "connection" com o parâmetro (databaseconfig) já possui conexão com a BASE DE DADOS
    models.map((model) => model.init(this.connection));
    //Vamos percorrer o ARRAY (Percorrer cada um dos MODELS), Vamos acessar o método INIT de cada MODEL
    //Ou qualquer outro método da minha CLASSE
    //Como parâmetro temos o (this.connection) substituimos pelo (sequelize) que está no User.js
  }
}

export default new Database();
