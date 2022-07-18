const {MongoClient} = require('mongodb');
async function connect(){
    if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb://localhost:27017/");
    if(!conn) return new Error("Can't connect");
    global.db = await conn.db("vendas");
    return global.db;
  }

  async function find(usuario){
    const db = await connect();
    return db.collection("usuarios").findOne(usuario);
  }

  async function insert(usuario){
    const db = await connect();
    return db.collection("usuarios").insertOne(usuario);
  }

  module.exports = {find, insert};