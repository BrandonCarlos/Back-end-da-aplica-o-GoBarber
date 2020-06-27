// ESTRUTURA DA APLICAÇÃO
// Aki vamos configurar o SERVIDOR [EXPRESS]
import express from 'express'; // IMPORTANDO O EXPRESS(IMPORTAÇÃO DE MODULOS)
import routes from './routes'; // IMPORTANDO AS ROTAS DE OUTRO ARQUIVO(ROUTES.JS), (IMPORTAÇÃO DE MODULOS)
import './database';//Chamando o arquivo de banco de dados

// Definindo a classe do app
// Toda vez que a (class App) ser chamada(INSTÂNCIADA), o método CONSTRUCTOR é
// executado AUTOMÁTICAMENTE
// Na aplicação a (class App) será chamada apenas UMA VEZ
class App {
  constructor() {
    // Definindo uma VARIAVEL dentro da CLASSE
    this.server = express();
    // Agente fazia server.get / server.put / server.delete / server.post
    // agora será this.server.get('/')
    // Vou passar o "middleWares()" e o "routes()" aki no CONSTRUCTOR(), se não eles
    // nunca serão CHAMADOS
    this.middleWares();
    this.routes();
  }

  // Vamos declarar MÉTODOS MIDDLEWARES na class App
  middleWares() {
    // Aki vou CADASTRAR OS MIDDLEWARES da aplicação
    // Antes: server.use(express.json());//"use", pedindo para UM PLUGIN, UM MÓDULO
    this.server.use(express.json()); // Agora a aplicação está pronta para receber REQUISIÇÕES
    // no formato JSON, EXPRESS LÊ JSON
    //console.log('text');// Se eu não tivesse tirado a REGRA = 'THIS' estária dando ERRO AGORA
    // MÉTODOS de uma CLASS só aceitam THIS por PADRÃO
  }

  routes() {
    this.server.use(routes); // As ROTAS vão funcionar como MIDDLEWARE
  }
}
// Vou exportar deste arquivo (app.js) uma nova INSTÂNCIA da (class App), exportando o "server"

export default new App().server; // (class App) vai acessar somente o server
