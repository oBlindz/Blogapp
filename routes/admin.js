// Importações
  // Random
    import moment from "moment"
  // Importando & configurando o nosso router
    import express from "express";
    const router = express.Router();
  // Importando banco de dados & CategoriaSchema
    import mongoose from "mongoose";
    import Categorias from "../models/Categoria.js";
    import PostagemSchema from "../models/Postagem.js";
    const Postagem = mongoose.model("postagens")
    const Categoria = mongoose.model("categorias");
    import eAdmin from "../helpers/eAdmin.js"
// Rotas admin
  // Listando categorias
    router.get("/categorias", eAdmin, (req, res) => {
      Categoria
      .find()
      .sort({data: "desc"})
      .lean()
      .then((categorias) => {
        // Configurando a data para ser no padrão BR
          categorias.forEach(categoria => {
            categoria.data = moment(categoria.data).format('DD/MM/YYYY')
          })
        res.render("admin/categorias", {categorias: categorias})
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as cetegorias...")
        console.log(err)
        res.redirect("/admin")
      })
    });
    // Criando categoria
      router.get("/addcategorias", eAdmin, (req, res) => {
        res.render("admin/addcategorias")
      });
      // Post de categorias
        router.post("/addcategorias/nova", eAdmin, (req, res) => {
          // Contador de erros
          let erros = []

          // Validadores
          if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome inválido"})
          }
          if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: "Slug inválido"})
          }
          if(req.body.nome.length <= 2){
            erros.push({texto: "Nome da categoria é muito pequeno"})
          }

          // Contador de erros
          if(erros.length > 0){
            res.render("admin/addcategorias", {erros: erros})
          } else {
            const novaCategoria = {
              nome: req.body.nome,
              slug: req.body.slug
            }
        
            // Salvando a categoria nova no banco de dados
              new Categoria(novaCategoria).save().then((novaCategoria) => {
                req.flash("success_msg", `Categoria "${novaCategoria.nome}" criada com sucesso!`)
                res.redirect("/admin/categorias")
              }).catch((err) => {
                req.flash("error_msg", `Houve um erro na criação da categoria "${novaCategoria.nome}"`)
                console.log(err)
                res.redirect("/admin/addcategorias")
              });
          }
        });
        // Rota de edição de categorias
          router.get("/categorias/editar/:id", eAdmin, (req, res) => {

            Categoria.findOne({_id: req.params.id}).then((categoria) => {
              res.render("../views/admin/editarcategorias", {categoria: categoria})
            }).catch((err) => {
              req.flash("error_msg", "Está categoria não existe...")
              console.log(err)
              res.redirect("/admin/categorias")
            })
          })
            // Salvar edição de categorias
            router.post("/editarcategoria/salvar", eAdmin, (req, res) => {
              // Contador de erros
              var erros = []
              
              // Validadores
              if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.length <= 2){
                erros.push({texto: "Nome inválido"})
              }
              if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
                erros.push({texto: "Slug inválido"})
              }

              // Contador de erros
              if (erros.length > 0) {
                console.log(erros)
                res.render("../views/admin/editarcategorias", {erros: erros})
              } else {
                console.log(erros)
                // Função de salvar as alterações:
                Categoria.findOne({_id: req.body.id}).then((categoria) => {
                  categoria.nome = req.body.nome
                  categoria.slug = req.body.slug

                  categoria.save().then(() => {
                    req.flash("success_msg", "Edição salva com sucesso!")
                    res.redirect("/admin/categorias")
                  }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao salvar a edição")
                    console.log(err)
                    res.redirect("/admin/categorias")
                  })
                })
              }
            })
            // Rota de exlusão de categorias
              router.post("/categorias/deletar/:id", eAdmin, (req, res) => {
                Categoria.findByIdAndDelete({_id: req.body.id}).then((categoria) => {
                  req.flash("success_msg", `Categoria "${categoria.nome}" deletada com sucesso!`)
                  res.redirect("/admin/categorias")
                }).catch((err) => {
                  req.flash("error_msg", "Houve um erro ao deletar a categoria")
                  console.log(err)
                  res.redirect("/admin/categorias")
                })
              })
  // Listagem de postagens
    router.get("/postagens", eAdmin, (req, res) => {
      Postagem
      .find()
      .populate("categoria")
      .sort({data: "desc"})
      .lean()
      .then((postagens) => {
        postagens.forEach(postagem => {
          postagem.data = moment(postagem.data).format("DD/MM/YYYY")
        })
        res.render("admin/postagens" ,{postagens: postagens})
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro ao tentar listar as postagens")
        console.log(err)
        res.redirect("/admin")
      })
    })
    // Criar postagem
      router.get("/postagens/add", eAdmin, (req, res) => {
        Categoria.find().then((categorias) => {
          res.render("admin/addpostagem", {categorias: categorias})
        }).catch((err) => {
          req.flash("error_msg", "Houve um erro ao carregar o formulário")
          res.redirect("/admin/postagens")
        })
      })
      // Post de postagens
        router.post("/postagens/add/nova", eAdmin, (req, res) => {
          // Contador de erros
          let erros = []

          // Validadores
            // titulo
            if(!req.body.titulo || req.body.titulo == undefined || req.body.titulo == null || req.body.titulo <= 4){
              erros.push({texto: "Título inválido"})
            }
            // slug
            if(!req.body.slug || req.body.slug == undefined || req.body.slug == null || req.body.slug <= 2){
              erros.push({texto: "Slug inválido"})
            }
            // conteudo
            if(!req.body.conteudo || req.body.conteudo == undefined || req.body.conteudo == null || req.body.conteudo <= 9){
              erros.push({texto: "Conteudo inválido"})
            }
            // categoria
            if(!req.body.categoria || req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == "0"){
              erros.push({texto: "Categoria inválida"})
            }
            // descricao
            if(!req.body.descricao || req.body.descricao == undefined || req.body.descricao == null || req.body.descricao <= 4){
              erros.push({texto: "Desctrição inválida"})
            }

          // Verificador de erros
          if(erros.length > 0){
            res.render("admin/addpostagem", {erros: erros})
          } else {
            const novaPostagem = {
              titulo: req.body.titulo,
              slug: req.body.slug,
              descricao: req.body.descricao,
              categoria: req.body.categoria,
              conteudo: req.body.conteudo
            }

            new Postagem(novaPostagem).save().then((postagem) => {
              console.log(`${postagem.titulo} criada com sucesso!`)
              req.flash("success_msg", `Postagem "${postagem.titulo}" criada com sucesso!`)
              res.redirect("/admin/postagens")
            }).catch((err) => {
              console.log(err)
              req.flash("error_msg", `Erro ao criar a postagem "${postagem.titulo}"`)
              res.redirect("/admin/postagens")
            })
          }
        }) 
        // Rota de edição de postagens
        router.get("/postagens/edit/:id", eAdmin, (req, res) => {
          Postagem.findOne({_id: req.params.id}).then((postagem) => {
            Categoria.find().then((categoria) => {
              res.render("../views/admin/editarpostagens", {categoria: categoria, postagem: postagem})
            }).catch((err) => {
              req.flash("error_msg", "Houve um erro ao carregar as categorias")
              console.log(err)
              res.redirect("/admin/postagens")
            })
          }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao tentar editar a categoria")
            console.log(err)
            res.redirect("/admin/postagens")
          })
        })
          // Rota de salvar edição de postagens
            router.post("/postagens/edit", eAdmin, (req, res) => {
              // Contador de erros
              let erros = []

              // Validadores
                // !Está vazio & tamanho
                
                // Titulo
                if(!req.body.titulo || req.body.titulo == undefined || req.body.titulo == null || req.body.titulo < 10){
                  erros.push({texto: "Título inválido"})
                }
                // Slug
                if(!req.body.slug || req.body.slug == undefined || req.body.slug == null || req.body.slug < 2){
                  erros.push({texto: "Slug inválido"})
                }
                // Descricao
                if(!req.body.descricao || req.body.descricao == undefined || req.body.descricao == null){
                  erros.push({texto: "Descrição inválida"})
                }
                // Categoria
                if(!req.body.categoria|| req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == "0"){
                  erros.push({texto: "Categoria inválida"})
                }
                // Conteudo
                if(!req.body.conteudo || req.body.conteudo == undefined || req.body.conteudo == null || req.body.conteudo < 10){
                  erros.push({texto: "Conteúdo inválido"})
                }
                // Verificador
                if(erros.length > 0){
                  console.log(erros)
                  res.render("../views/admin/editarpostagens", {erros: erros})
                } else {
                  Postagem.findOne({_id: req.body.id}).then((postagem) => {
                    postagem.titulo = req.body.titulo
                    postagem.slug = req.body.slug
                    postagem.descricao = req.body.descricao
                    postagem.conteudo = req.body.conteudo
                    postagem.categoria = req.body.categoria

                    postagem.save().then(() => {
                      req.flash("success_msg", `postagem editada com sucesso!`)
                      res.redirect("/admin/postagens")
                    }).catch((err) => {
                      req.flash("error_msg", "Houve um erro ao salvar a edição")
                      console.log(err)
                      res.redirect("/admin/postagens")
                    })
                  })
                }
            })
            // Rota de deletar postagem
            router.get("/postagens/deletar/:id", eAdmin, (req, res) => {
              Postagem.deleteOne({_id: req.params.id}).then(() => {
                req.flash("success_msg", "Postagem deletada com sucesso!")
                res.redirect("/admin/postagens")
              }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao deletar a categoria")
                console.log(err)
                res.redirect("/admin/postagens")
              })
            }) 

// Rota de teste
  router.get("/", eAdmin, (req, res) => {
    res.send("Hello world")
  })

// Exportando o nosso Router
  export default router;