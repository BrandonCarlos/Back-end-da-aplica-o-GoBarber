//Este "middlwware", irá fazer a validação se o usuário está logado
//Precisamos buscar o "token"
//Vamos exportar o "middleware", ele sempre irá ser uma "function"
//Vamos usar a "library"
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';//Precisamos importar o authConfig também
//por que é lá que está o segredo(secret) do "token"
//preciso tentar usar esse "segredo", para discryptografar esse "token" e ver se ele está
//válido
import { promisify } from 'util';//""util", que é um biblioteca que vem por padrão junto com o "node"
//"promisify" = é uma função, que pega uma função "callback", e transforma ela em um função que eu
//posso usar "async e await"

export default async (req, res, next) => {
  //Vamos buscar o "Header"
  const authHeader = req.headers.authorization;//Nome do Header que estou enviando lá pro "insomnia"

  if (!authHeader) {//Se esse "Header" não estiver presente aki dentro
    return res.status(401).json({ error: 'Token not provided' });//"Token", não foi enviado na requisição
  }

  const [, token] = authHeader.split(' ');//Vamos dividir a Header, porque vem com o Baerer e o "token"
  //"token" é o que agente realmente quer
  //[, token] = faz com que peguemos apenas o "token" e não o baerer

  try {//Existe um método dentro do "jwt" chamado "verify"
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);//Se não conseguir decifrar
    //o "token" irá cair no "catch"
    //Dentro do promisify eu coloco qual o método que eu quero promissificar, que ele era um  "callback",
    //antes

    req.userId = decoded.id;

    return next();

    //decoded = que é o valor retornado atráves do "jwt" veryfay
  } catch (err) {//Se retornar erro significa que o "token" é inválido
    jwt.verify
    return res.status(401).json({ error: 'Token invalid' });
  }

};
