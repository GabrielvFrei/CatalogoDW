import mongoose from 'mongoose';
import Autor from './Autor.js';

const livroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  isbn: String,
  anoPublicacao: Number,
  numeroPaginas: Number,
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor' },
  createdAt: { type: Date, default: Date.now }
});

const Livro = mongoose.models.Livro || mongoose.model('Livro', livroSchema);
export default Livro;
