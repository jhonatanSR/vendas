const {MongoClient,ObjectId} = require('mongodb');
async function connect(){
    if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb://localhost:27017/");
    if(!conn) return new Error("Can't connect");
    global.db = await conn.db("vendas");
    return global.db;
  }
/* USUARIOS */
  async function findAll(){
    const db = await connect();
    return db.collection("usuarios").find().toArray();
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

  async function deleteOne(id){
    const db = await connect(); 
    const filter = {_id: new ObjectId(id)};
    return db.collection("usuarios").deleteOne(filter);
}

/* PRODUTOS */

  async function findAllP(){
    const db = await connect();
    return db.collection("produtos").find().toArray();
  }

  async function findP(produto){
    const db = await connect();
    return db.collection("produtos").find(produto).toArray();
  }

  async function findOneP(id){
    const db = await connect();
    const objId = new ObjectId(id);
    return db.collection("produtos").findOne(objId);
  }

  async function insertP(produto){
    const db = await connect();
    return db.collection("produtos").insertOne(produto);
  }

  async function updateP(id,produto){
    const filter = {_id: new ObjectId(id)}
    const db = await connect();
    return db.collection("produtos").updateOne(filter,{"$set":produto});
  }

  async function deleteOneP(id){
    const db = await connect(); 
    const filter = {_id: new ObjectId(id)};
    return db.collection("produtos").deleteOne(filter);
}

  async function procurarP(letra){
    const db = await connect();
    return db.collection("produtos").find({produto: new RegExp(letra)}).sort({"produto":1}).toArray();
  }

  async function findAllPOrd(){
    const db = await connect();
    return db.collection("produtos").find().sort({"produto":1}).toArray();
  }

  module.exports = {findAll,find, insert,findOne,update,deleteOne,findAllP,findP,findOneP,insertP,updateP,deleteOneP,procurarP,findAllPOrd};