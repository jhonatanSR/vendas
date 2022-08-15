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

rota.get('/produtos/:id',verificaJWT,async(req,res)=>{
    const id = req.params.id;
    const item = req.query.item;
    const item1 = await db.procurarP(item);
    res.render('produtos',{action:'/cadastroP/'+id,id,item1});
})

rota.get('/deleteP/:id', async(req,res)=>{
    const id = req.params.id;
    const produto = req.query.produto;
    await db.deleteOneP(produto);
    res.redirect('/produtos/'+id);
})

rota.get('/cadastroP/:id',verificaJWT,async(req,res)=>{
    const id = req.params.id;
    res.render('cadastroP',{action:"/cadastroP/"+id,id,doc:{}});
})

rota.get('/editarP/:id',verificaJWT,async(req,res)=>{
    const id = req.params.id;
    const item = req.query.item;
    res.render('cadastroP',{doc: await db.findOneP(item),action:"/updateP/"+id+"?item="+item,id});
})

rota.get('/caixa/:id',verificaJWT,async(req,res)=>{
    const id = req.params.id;
    const doc = await db.findOne(id);
    const item = req.query.item;
    const item1 = await db.procurarP(item);
    const produto = req.query.produto;
    const item2 = await db.findOneP(produto);
    res.render('caixa',{doc,id,item1,item2});
})
/********************************************************/

rota.post('/cadastro', async(req,res) =>{
    const dados = req.body;
    const nomes = dados.nome;
    const nome = nomes.toUpperCase();
    let senha = dados.senha;
    let senhaAdm = dados.senhaAdm;
    const criadoEm = new Date().toLocaleString();
    const senhaHash = bcrypt.hashSync(senha,10);
    //const admHash = bcrypt.hashSync(senhaAdm,10);
    const adm = await db.find({nome:"JHONATAN"});
    const user = await db.find({nome: nome});
    
    if(bcrypt.compareSync(senhaAdm, adm.senhaAdm)){
       if(!user){
        senha = senhaHash;
        await db.insert({nome,senha,criadoEm});
        return res.redirect('/?sucesso');
        }
    }
    if(!(bcrypt.compareSync(senhaAdm, adm.senhaAdm))){
        return res.redirect('/cadastro?fail');
    }
    return res.redirect('/cadastro?userE')
    
})

rota.post('/autenticar', async(req,res,next) =>{
    const nomes = req.body.nome;
    const nome = nomes.toUpperCase();
    const senha = req.body.senha;
    const usuario = await db.find({nome});
    if(!usuario){
        return res.redirect('/?userFail');
    }   
    const deu = bcrypt.compareSync(senha, usuario.senha);
    if(!(deu)){
        return res.redirect('/?senhaFail');
    }
    const token = jwt.sign({id: usuario._id},config.secret,{expiresIn: 86400});
    const id = usuario._id;
    await db.update(id,{token});
    usuario.senha = undefined;
    res.redirect('/inicio/'+usuario._id);

    

    
})

rota.post('/logout/:id', async (req,res) =>{
    const id = req.params.id;
    await db.update(id,{token:""});

    res.redirect('/?logout');
    
})

rota.post('/cadastroP/:id', async(req,res)=>{
    const id = req.params.id;
    const produtos = req.body.produto;
    const produto = produtos.toUpperCase();
    const preco = req.body.preco;
    const quantidade = req.body.qtd;
    const codigo = req.body.cod; 
    await db.insertP({produto,preco,quantidade,codigo});
    res.redirect('/cadastroP/'+id);
})

rota.post('/updateP/:id', async(req,res)=>{
    const id = req.params.id;
    const item = req.query.item;
    const produtos = req.body.produto;
    const produto = produtos.toUpperCase();
    const preco = req.body.preco;
    const quantidade = req.body.qtd;
    const codigo = req.body.cod;
    await db.updateP(item,{produto,preco,quantidade,codigo});
    res.redirect('/produtos/'+id);
})

rota.post('/findProd/:id', async(req,res)=>{
    const id = req.params.id;
    const produto = req.body.procurar;
    const item = produto.toUpperCase();
    res.redirect('/produtos/'+id+"?item="+item);


})
rota.post('/caixaFindProd/:id', async(req,res)=>{
    const id = req.params.id;
    const produto = req.body.procurar;
    const item = produto.toUpperCase();
    res.redirect('/caixa/'+id+"?item="+item);
})


module.exports = rota;