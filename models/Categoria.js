// Importando o mongoose
  import mongoose, { model, mongo } from "mongoose";
// Criando o Schema de categoria
  const { Schema } = mongoose;
  const Categoria = new Schema({
    nome: {type:String, require: true},
    slug: {type:String, require: true},
    data: {type:Date, default: Date.now()}
  });

  mongoose.model("categorias", Categoria);
  export default Categoria;