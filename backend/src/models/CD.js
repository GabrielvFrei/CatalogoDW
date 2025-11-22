import mongoose from 'mongoose';
import Autor from './Autor.js';

const cdSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  artista: String,
  anoLancamento: Number,
  numeroFaixas: Number,
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor' },
  createdAt: { type: Date, default: Date.now }
});

const CD = mongoose.models.CD || mongoose.model('CD', cdSchema);
export default CD;
