import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);
export default Usuario;
