import mongoose from 'mongoose';
import Autor from './Autor.js';

const dvdSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  duracao: Number,
  anoLancamento: Number,
  diretor: String,
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor' },
  createdAt: { type: Date, default: Date.now }
});

const DVD = mongoose.models.DVD || mongoose.model('DVD', dvdSchema);
export default DVD;
