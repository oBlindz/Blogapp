// Importand depdenências
  import Passport from '../config/auth.js';
  import passport from 'passport';
  import express from 'express';
  const router = express.Router()
  import mongoose  from 'mongoose';
  import Usuario from '../models/Usuarios.js';
  const Usuarios = mongoose.model("usuarios");
  import bcrypt from "bcryptjs";

  // Rotas de acesso GET
  router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
  })
  router.get("/login", (req, res) => {
    res.render("usuarios/login")
  })
  router.get("/logout", (req, res) => {
    req.logout(() => {
      req.flash("success_msg", "Deslogado com sucesso!")
      res.redirect("/")
    })
  })
  
  // Rotas de acesso POST
  router.post("/registro", (req, res) => {
    // Validação de erros
    // Contador de erros
      let erros = []

    // Validadores
      if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
      }
      if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido!"})
      }
      if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida"})
      }
      if(!req.body.senha2 || typeof req.body.senha2 == undefined || req.body.senha2 == null){
        erros.push({texto: "Senha inválida"})
      }
      if(req.body.senha < 4){
        erros.push({texto: "Senha muito curta"})
      }
      if(req.body.nome < 4){
        erros.push({texto: "Nome muito curto, digite nome e sobrenome..."})
      }
      if(req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas diferentes"})
      }

    // Validador de erros
      if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
      } else {
        Usuarios
        .findOne({email: req.body.email})
        .lean()
        .then((usuario) => {
          if(usuario){
            req.flash("error_msg", "Este email já foi registrado")
            res.redirect("/registro")
          } else {
            const novoUsuario = new Usuarios({
              nome: req.body.nome,
              email: req.body.email,
              senha: req.body.senha
            })

            // Protegendo a senha do meu novo usuário
            bcrypt.genSalt(10, (erro, salt) => {
              bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                if(erro){
                  req.flash("error_msg", "Houve um erro ao registrar o usuário")
                  res.redirect("/usuarios/registro")
                }
                // Salvando a senha protegida
                novoUsuario.senha = hash

                // Salvando novo usuário
                novoUsuario.save().then((user) => {
                  req.flash("success_msg", `${user.nome} registrado com sucesso!`)
                  console.log("Usuario registrado com sucesso!")
                  res.redirect("/")
                }).catch((err) => {
                  req.flash("error_msg", "Houve um erro ao registrar o usuário, tente novamente")
                  console.log(err)
                  res.redirect("/usuarios/registro")
                })
              })
            })
          }
        }).catch((err) => {
          req.flash("error_msg", "Houve um erro interno, tente novamente mais tarde")
          console.log(err)
          res.redirect("/")
        })
      }
  })
  router.post("/login", 
    passport.authenticate('local', {
      failureRedirect: "/usuarios/login",
      failureFlash: true
    }), 
    function(req, res){
      if(req.isAuthenticated){
        req.flash("success_msg", "Logado com sucesso!")
        res.redirect('/')
      } else {
        req.flash("error_msg", "Senha incorreta")
        res.redirect("/")
      }
  })

  export default router;