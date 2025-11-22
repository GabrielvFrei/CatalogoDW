import mongoose from 'mongoose';

const autorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  nacionalidade: String,
  anoNascimento: Number,
  createdAt: { type: Date, default: Date.now }
});

const Autor = mongoose.models.Autor || mongoose.model('Autor', autorSchema);
export default Autor;
