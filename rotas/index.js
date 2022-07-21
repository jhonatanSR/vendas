const express = require('express');
const rota = express.Router();
const db = require('../db.js');
const bcrypt = require('bcrypt');

rota.get('/', async (req,res) =>{
    const adm = await db.find({nome:"jhon"});
    res.render('index',{adm});
})

rota.get('/cadastro', async(req,res,next) =>{
    res.render('cadastro',{action: "/cadastro"});
})
/********************************************************/

rota.post('/cadastro', async(req,res) =>{
    const dados = req.body;
    const nome = dados.nome;
    let senha = dados.senha;
    let senhaAdm = dados.senhaAdm;
    const senhaHash = bcrypt.hashSync(senha,10);
    const admHash = bcrypt.hashSync(senhaAdm,10);
    const adm = await db.find({nome:"Jhonatan"}); 
    
    if(bcrypt.compareSync(senhaAdm, adm.senhaAdm)){
       if(nome === adm.nome){
        return res.redirect('/cadastro?userE')
        }
    }
    if(senha=="" || !(bcrypt.compareSync(senhaAdm, adm.senhaAdm))){
        return res.redirect('/cadastro?fail');
    }
    senha = senhaHash;
    await db.insert({nome,senha});

    res.redirect('/?sucesso');
})

rota.post('/autenticar', async(req,res) =>{
    const nome = req.body.nome;
    const senha = req.body.senha;
    const usuario = await db.find({nome});
    const deu = bcrypt.compareSync(senha, usuario.senha);
    if(!usuario){
        return res.redirect('/?userFail');
    }   

    if(!(deu)){
        return res.redirect('/?senhaFail');
    }
        
    

    res.send(usuario);
    
})

module.exports = rota;