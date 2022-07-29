const express = require('express');
const rota = express.Router();
const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../public/config/config.json');

/* middleware */
async function verificaJWT(req,res,next){
    const id = req.params.id;
    const usuario = await db.findOne(id);
    const token = usuario.token;
    //const token = req.query.token;
    jwt.verify(token,config.secret,(err,decoded)=>{
        if(err) return res.redirect('/?token=expirou');
        
        req.id = decoded.id;
        next();
    })

}



rota.get('/', async (req,res) =>{
    res.render('index');
})

rota.get('/cadastro', async(req,res) =>{
    res.render('cadastro',{action: "/cadastro"});
})

rota.get('/inicio/:id',verificaJWT , async(req,res) =>{
    const id = req.params.id;
    const doc = await db.findOne(id);

    res.render('inicio',{doc,action: "/logout/" + id});
})
/********************************************************/

rota.post('/cadastro', async(req,res) =>{
    const dados = req.body;
    const nome = dados.nome;
    let senha = dados.senha;
    let senhaAdm = dados.senhaAdm;
    const criadoEm = new Date().toLocaleString();
    const senhaHash = bcrypt.hashSync(senha,10);
    //const admHash = bcrypt.hashSync(senhaAdm,10);
    const adm = await db.find({nome:"Jhonatan"});
    const user = await db.find({nome: nome});
    
    if(bcrypt.compareSync(senhaAdm, adm.senhaAdm)){
       if(!user){
        senha = senhaHash;
        await db.insert({nome,senha,criadoEm});
        return res.redirect('/?sucesso');
        }
    }
    if(senha=="" || !(bcrypt.compareSync(senhaAdm, adm.senhaAdm))){
        return res.redirect('/cadastro?fail');
    }
    return res.redirect('/cadastro?userE')
    
})

rota.post('/autenticar', async(req,res,next) =>{
    const nome = req.body.nome;
    const senha = req.body.senha;
    const usuario = await db.find({nome});
    const deu = bcrypt.compareSync(senha, usuario.senha);
    const token = jwt.sign({id: usuario._id},config.secret,{expiresIn: 86400});
    const id = usuario._id;
    await db.update(id,{token});
    
    if(!usuario){
        return res.redirect('/?userFail');
    }   

    if(!(deu)){
        return res.redirect('/?senhaFail');
    }
    usuario.senha = undefined;
    res.redirect('/inicio/'+usuario._id);

    

    
})

rota.post('/logout/:id', async (req,res) =>{
    const id = req.params.id;
    await db.update(id,{token:""});

    res.redirect('/?logout');
    
})

module.exports = rota;