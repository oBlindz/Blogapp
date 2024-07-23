// Importando dependências
  import mongoose from "mongoose"; 
  const {Schema} = mongoose
// Definindo modelo de usuário
  const Usuario = new Schema({
    nome:{type: String, require: true},
    email:{type: String, require: true},
    senha:{type: String, require: true},
    eAdmin:{type: Number, default: 0}
  })
  mongoose.model("usuarios", Usuario)
  export default Usuario