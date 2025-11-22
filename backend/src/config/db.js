import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
import Autor from '../models/Autor.js';
import Livro from '../models/Livro.js';
import DVD from '../models/DVD.js';
import CD from '../models/CD.js';

export default async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI não configurado');

    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado com sucesso');

    // Criar usuário admin padrão se não existir
    const adminExists = await Usuario.findOne({ email: 'admin@biblioteca.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 12);
      await Usuario.create({ nome: 'Administrador', email: 'admin@biblioteca.com', password: hashedPassword });
      console.log('👤 Usuário admin criado: admin@biblioteca.com / 123456');
    }

    // Seed de autores e itens de exemplo (se vazio)
    const autoresCount = await Autor.countDocuments();
    if (autoresCount === 0) {
      const autor1 = await Autor.create({ nome: 'Machado de Assis', nacionalidade: 'Brasileiro', anoNascimento: 1839 });
      const autor2 = await Autor.create({ nome: 'Clarice Lispector', nacionalidade: 'Brasileira', anoNascimento: 1920 });

      await Livro.create({ titulo: 'Dom Casmurro', isbn: '9788535934345', anoPublicacao: 1899, numeroPaginas: 256, autor: autor1._id });
      await Livro.create({ titulo: 'A Hora da Estrela', isbn: '9788535934346', anoPublicacao: 1977, numeroPaginas: 96, autor: autor2._id });

      await DVD.create({ titulo: 'O Auto da Compadecida', duracao: 104, anoLancamento: 2000, diretor: 'Guel Arraes', autor: autor1._id });

      await CD.create({ titulo: 'Acústico MTV', artista: 'Cássia Eller', anoLancamento: 2001, numeroFaixas: 14, autor: autor2._id });

      console.log('📚 Dados de exemplo criados com sucesso!');
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message || error);
    throw error;
  }
}
