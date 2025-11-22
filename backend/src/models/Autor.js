import mongoose from 'mongoose';
import Livro from './Livro.js';
import DVD from './DVD.js';
import CD from './CD.js';

const autorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  nacionalidade: String,
  anoNascimento: Number,
  createdAt: { type: Date, default: Date.now }
});

// Exclusão em cascata: quando um autor for removido, também removemos
// automaticamente todas as obras relacionadas (livros, DVDs e CDs).
// Isso garante que não fiquem referências órfãs no banco.
autorSchema.pre('remove', async function (next) {
  try {
    const id = this._id;
    await Promise.all([
      Livro.deleteMany({ autor: id }),
      DVD.deleteMany({ autor: id }),
      CD.deleteMany({ autor: id })
    ]);
    next();
  } catch (err) {
    next(err);
  }
});

autorSchema.pre('findOneAndDelete', async function (next) {
  try {
    // Aqui `this` é a query; buscamos o documento para obter o _id
    // e então remover as obras associadas a esse autor.
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
      const id = doc._id;
      await Promise.all([
        Livro.deleteMany({ autor: id }),
        DVD.deleteMany({ autor: id }),
        CD.deleteMany({ autor: id })
      ]);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Autor = mongoose.models.Autor || mongoose.model('Autor', autorSchema);
export default Autor;
