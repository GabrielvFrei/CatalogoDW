import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend static files
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// 🔥 DADOS MOCK - SEMPRE DISPONÍVEIS
const mockData = {
  autores: [
    { _id: '1', nome: 'Machado de Assis', nacionalidade: 'Brasileiro', anoNascimento: 1839 },
    { _id: '2', nome: 'Clarice Lispector', nacionalidade: 'Brasileira', anoNascimento: 1920 },
    { _id: '3', nome: 'Jorge Amado', nacionalidade: 'Brasileiro', anoNascimento: 1912 }
  ],
  livros: [
    { 
      _id: '1', 
      titulo: 'Dom Casmurro', 
      isbn: '9788535934345', 
      anoPublicacao: 1899, 
      numeroPaginas: 256, 
      autor: { _id: '1', nome: 'Machado de Assis' } 
    },
    { 
      _id: '2', 
      titulo: 'A Hora da Estrela', 
      isbn: '9788535934346', 
      anoPublicacao: 1977, 
      numeroPaginas: 96, 
      autor: { _id: '2', nome: 'Clarice Lispector' } 
    }
  ],
  dvds: [
    { 
      _id: '1', 
      titulo: 'O Auto da Compadecida', 
      duracao: 104, 
      anoLancamento: 2000, 
      diretor: 'Guel Arraes', 
      autor: { _id: '1', nome: 'Machado de Assis' } 
    }
  ],
  cds: [
    { 
      _id: '1', 
      titulo: 'Acústico MTV', 
      artista: 'Cássia Eller', 
      anoLancamento: 2001, 
      numeroFaixas: 14, 
      autor: { _id: '2', nome: 'Clarice Lispector' } 
    }
  ]
};

// 🔥 ROTAS SIMPLES E CONFIÁVEIS
app.get('/api/autores', (req, res) => {
  console.log('📖 Retornando autores mock');
  res.json({ 
    success: true, 
    count: mockData.autores.length,
    data: mockData.autores 
  });
});

app.get('/api/livros', (req, res) => {
  console.log('📚 Retornando livros mock');
  res.json({ 
    success: true, 
    count: mockData.livros.length,
    data: mockData.livros 
  });
});

app.get('/api/dvds', (req, res) => {
  console.log('🎬 Retornando DVDs mock');
  res.json({ 
    success: true, 
    count: mockData.dvds.length,
    data: mockData.dvds 
  });
});

app.get('/api/cds', (req, res) => {
  console.log('🎵 Retornando CDs mock');
  res.json({ 
    success: true, 
    count: mockData.cds.length,
    data: mockData.cds 
  });
});

// 🔥 HEALTH CHECK SEM MONGODB
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ API funcionando perfeitamente com dados mock',
    database: 'Mock Data (Otimizado para Vercel)',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// 🔥 LOGIN MOCK FUNCIONAL
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Tentativa de login:', email);
  
  if (email === 'admin@biblioteca.com' && password === '123456') {
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token: 'mock-token-vercel-2024',
      user: { 
        id: '1', 
        nome: 'Administrador', 
        email: 'admin@biblioteca.com' 
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
});

// 🔥 ROTAS ADMIN MOCK (para CRUD funcionar)
app.post('/api/autores', (req, res) => {
  const novoAutor = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockData.autores.push(novoAutor);
  res.json({ success: true, data: novoAutor });
});

app.post('/api/livros', (req, res) => {
  const novoLivro = {
    _id: Date.now().toString(),
    ...req.body,
    autor: mockData.autores.find(a => a._id === req.body.autor),
    createdAt: new Date().toISOString()
  };
  mockData.livros.push(novoLivro);
  res.json({ success: true, data: novoLivro });
});

// Serve frontend index at root
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Serve outras páginas do frontend
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(frontendDir, 'login.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(frontendDir, 'admin.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 SERVIDOR RODANDO NO VERCEL!');
  console.log(`📍 Porta: ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'production'}`);
  console.log('📊 Banco de dados: MOCK DATA (100% funcional)');
  console.log('👤 Login de teste: admin@biblioteca.com / 123456');
  console.log(`🔗 URL: https://catalogo-dw.vercel.app`);
});

export default app;