const {MongoClient,ObjectId} = require('mongodb');
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

  async function findOne(id){
    const db = await connect();
    const objId = new ObjectId(id);
    return db.collection("usuarios").findOne(objId);
  }

  async function insert(usuario){
    const db = await connect();
    return db.collection("usuarios").insertOne(usuario);
  }

  async function update(id,usuario){
    const filter = {_id: new ObjectId(id)}
    const db = await connect();
    return db.collection("usuarios").updateOne(filter,{"$set":usuario});
  }


  module.exports = {find, insert,findOne,update};