// Importando as dependências
  import  mongoose, { mongo }  from 'mongoose';
  import { Schema } from 'mongoose';

// Criando o modelo
  const PostagemSchema = new Schema({
    titulo: {type: String, require: true}, 
    slug: {type: String, require: true}, 
    descricao: {type: String, require: true}, 
    categoria: {type: Schema.Types.ObjectId, ref: "categorias", require: true}, 
    conteudo: {type: String, require: true}, 
    data: {type: Date, default: Date.now()}
  });

  mongoose.model("postagens", PostagemSchema);
  export default PostagemSchema