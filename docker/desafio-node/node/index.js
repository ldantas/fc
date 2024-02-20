//Web
const express = require('express')
const app = express()
const port = 3000

//Banco de dados
const config = {
    host: 'mysql',
    user: 'usuario',
    password: 'senha',
    database: 'db',
    multiple_queries: true
}
const mysql = require('mysql')
const connection = mysql.createConnection(config)

//Cria a tabela
const createTable = `CREATE TABLE IF NOT EXISTS PESSOA(  
    id int not null auto_increment,  
    nome varchar(255),
    PRIMARY KEY (id)
)`

//Insere um novo registro a cada inicializacao
const insertPerson = `INSERT INTO PESSOA(nome) SELECT CONCAT('Le Dantas ', count(nome)+1) FROM PESSOA`

connection.query(createTable)
connection.query(insertPerson)
//connection.end() - Nao encerrar a conexao para uso posterior.

//Informacoes do host
var os = require("os");
var hostname = os.hostname();

function getPessoas(data, callback){
    const queryPessoa = `SELECT nome FROM PESSOA ORDER BY nome`
    connection.query(queryPessoa, function(err, results){
          if (err){ 
            throw err;
          }
          return callback(results);
  })
}

app.get('/healthcheck', (req, res) => {
    console.log('Health check')
})

app.get('/', (req, res) => {
    //Conteudo da pagina
    var content = '<h1>Full Cycle Rocks!</h1>'
    getPessoas(req, function(result){
       let rows = result;
       for(const row of rows){
            content += '<br>' + row.nome 
       }
        //Acrescenta o id do container apenas para informacao
        content += '<br><br>Container: ' + hostname
       res.send(content)
    });

}) 

app.listen(port, () => {
    console.log('Rodando na porta:' + port )
})