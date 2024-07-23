// Importando dependências e features necessárias...
import passport from "passport"
import {Strategy as LocalStratefy} from "passport-local"
import mongoose from "mongoose"
import bcrypt from 'bcryptjs';
import Usuario from "../models/Usuarios.js"
const Usuarios = mongoose.model("usuarios")

// Configurando o passport
const Passport = (passport) => {
  passport.use(new LocalStratefy({usernameField: "email", passwordField: "senha"}, (email, senha, done) => {
    Usuarios
    .findOne({email: email})
    .lean()
    .then((usuario) => {
      if(!usuario){
        return done(null, false, {message: "Está conta não existe"})
      }

      bcrypt.compare(senha, usuario.senha, (erro, batem) => {
        if(batem){
          return done(null, usuario)
        } else {
          return done(null, false, {message: "Senha incorreta"})
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }))

// Salvando os dados em uma sessão
  passport.serializeUser((usuario, done) => {
    done(null, usuario)
  })
  passport.deserializeUser((usuario, done) => {
    done(null, usuario)
  })
}

export default Passport