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

  // ADICIONE ESTAS OPÇÕES DE TIMEOUT
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 segundos
      socketTimeoutMS: 45000, // 45 segundos
      bufferCommands: false,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

  await mongoose.connect(uri, options);

    // Criar usuário admin padrão se não existir
    const adminExists = await Usuario.findOne({ email: 'admin@biblioteca.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 12);
      await Usuario.create({ 
        nome: 'Administrador', 
        email: 'admin@biblioteca.com', 
        password: hashedPassword, 
        role: 'admin' 
      });
      
    }

    // Seed de autores e itens de exemplo (se vazio)
    const autoresCount = await Autor.countDocuments();
    if (autoresCount === 0) {
      const autor1 = await Autor.create({ 
        nome: 'Machado de Assis', 
        nacionalidade: 'Brasileiro', 
        anoNascimento: 1839 
      });
      
      const autor2 = await Autor.create({ 
        nome: 'Clarice Lispector', 
        nacionalidade: 'Brasileira', 
        anoNascimento: 1920 
      });

      await Livro.create({ 
        titulo: 'Dom Casmurro', 
        isbn: '9788535934345', 
        anoPublicacao: 1899, 
        numeroPaginas: 256, 
        autor: autor1._id 
      });
      
      await Livro.create({ 
        titulo: 'A Hora da Estrela', 
        isbn: '9788535934346', 
        anoPublicacao: 1977, 
        numeroPaginas: 96, 
        autor: autor2._id 
      });

      await DVD.create({ 
        titulo: 'O Auto da Compadecida', 
        duracao: 104, 
        anoLancamento: 2000, 
        diretor: 'Guel Arraes', 
        autor: autor1._id 
      });

      await CD.create({ 
        titulo: 'Acústico MTV', 
        artista: 'Cássia Eller', 
        anoLancamento: 2001, 
        numeroFaixas: 14, 
        autor: autor2._id 
      });

      
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    // Não throw error aqui - deixa o servidor rodar mesmo sem DB
    
  }
}