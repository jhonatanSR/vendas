const express = require('express');
const app = express();
//const db = require('./db.js');
const bodyParser = require('body-parser');
const port = 3000;
const rota = require('./rotas/index.js');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(express.static('views'));

//view engine
app.set('view engine','ejs');

//rota
app.use('/', rota);

app.listen(port);
console.log("Funcionando...");

