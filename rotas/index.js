const express = require('express');
const rota = express.Router();
const db = require('../db.js');

rota.get('/', async (req,res) =>{
    const adm = await db.find({nome:"jhon"});
    res.render('index',{adm});
})

rota.get('/cadastro', async(req,res,next) =>{
    res.render('cadastro',{action: "/cadastro"});
})
/********************************************************/

rota.post('/cadastro', async(req,res) =>{
    const {nome,senha,senhaAdm} = req.body;
    const adm = await db.find({nome:"jhon"});
    
    if(senhaAdm == adm.senhaADM){
        if(await db.find({nome})){
        return res.status(400).send({erro: "Usuario ja existe!"});
        }else{
            await db.insert({nome,senha});
        }
    }else if(senhaAdm == "" || senhaAdm != adm.senhaADM){
      return res.redirect("/cadastro?fail");
    }
    res.redirect('/?sucesso');
})

rota.post('/autenticar', async(req,res) =>{
    const {nome,senha} = req.body;
    const usuario = await db.find({nome});
    if(!usuario){
        return res.redirect('/?userFail');
    }
    if(usuario.senha != senha){
        return res.redirect('/?senhaFail');
    }
    res.send(usuario);
})

module.exports = rota;