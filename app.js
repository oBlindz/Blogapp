// Importando as dependências
  import express from "express";
  const app = express()
  import { engine } from "express-handlebars";
  import Handlebars from "handlebars";
  import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
  import mongoose from "mongoose";
  import admin from "./routes/admin.js";
  import usuarios from "./routes/usuario.js";
  import path from "path";
  import { fileURLToPath } from "url";
  import { dirname } from "path";
  import session from "express-session";
  import flash from "connect-flash"
  import Postagens from "./models/Postagem.js";
  const Postagem = mongoose.model("postagens")
  import moment from "moment";
  import { Stats } from "fs";
  import Categoria from "./models/Categoria.js";
  const Categorias = mongoose.model("categorias");
  import Usuarios from "./models/Usuarios.js";
  const Usuario = mongoose.model("usuarios")
  import Passport from "./config/auth.js";
  import passport from "passport";
// Configurando as dependências
  // Sessão
    app.use(session({
      secret: "nukaiQueriaSerTop1NãoVai!",
      resave: true,
      saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    Passport(passport)
    app.use(flash());
  // Middleware
    // Globais
      app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null;
        next()
      });
  // Express 
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
  // Handlebars
    app.engine('handlebars', engine({
      handlebars: allowInsecurePrototypeAccess(Handlebars)
    }));
    app.set('view engine', 'handlebars');
    app.set('views', './views');
  // Mongoose
    mongoose.connect(`mongodb+srv://dbUser:senhafacil123@blogapp.urkakah.mongodb.net/?retryWrites=true&w=majority&appName=Blogapp`).then(() => {
      console.log(`Mongo conectado!`);
    }).catch((err) => {
      console.log(`Houve o seguinte erro: ${err}`);
    });
  // Bootstrap
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
  // Public
    app.use(express.static(path.join(__dirname, "public")));
// Rotas
  // Rota principal
    app.get('/', (req, res) => {
      Postagem
      .find()
      .populate("categoria")
      .sort({data: "desc"})
      .lean()
      .then((postagens) => {
        postagens.forEach((postagem) => {
          postagem.data = moment(postagem.data).format("DD/MM/YYYY")
        })
        res.render("index", {postagens: postagens})
      }).catch((err) => {
        console.log(err)
        res.redirect("/404")
      })
    });
    // Rota de erro 404
      app.get("/404", (req, res) => {
        req.flash("error_msg", "Página não encontrada")
        res.send("erro 404")
      })
      // Rota da postagem
        app.get("/postagens/:slug", (req, res) => {
          Postagem.findOne({slug: req.params.slug}).then((postagem) => {
            if(postagem){
              res.render("../views/postagem/index", {postagem: postagem})
            } else {
              req.flash("error_msg","Essa página não existe")
              res.redirect("/")
            }
          }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            console.log(err)
            res.redirect("/")
          })
        })
        // Rota de categorias
          app.get("/categorias", (req,res) => {
            Categorias
            .find()
            .lean()
            .then((categorias) => {
              res.render("./categoria/index", {categorias: categorias})
            }).catch((err) => {
              req.flash("error_msg", "Houve um erro interno ao listar as categorias")
              console.log(err)
              res.redirect("/")
            })
          })
          // Rota de listagem de posts por categoria
            app.get("/categorias/:slug", (req, res) => {
              Categorias
              .findOne({slug: req.params.slug})
              .lean()
              .then((categoria) => {
                if(categoria){
                  Postagem
                  .find({categoria: categoria._id})
                  .lean()
                  .then((postagens) => {
                    res.render("./categoria/postagens", {categoria: categoria, postagens: postagens})
                  }).catch((err) => {
                    req.flash("error_msg", "Houve um erro interno ao carregar as postagens")
                    console.log(err)
                    res.redirect("/")
                  })
                }else{
                  req.flash("error_msg", "Está categoria não existe")
                  res.redirect("/")
                }
              }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao carregar os posts desta categoria")
                console.log(err)
                res.redirect("/")
              })
            })

  // Rotas ADM
    app.use("/admin", admin);
  // Rota de usuário
    app.use("/usuarios", usuarios)
// Outros
  // Configurando porta & abrindo o servidor
    const port = 8081;
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });