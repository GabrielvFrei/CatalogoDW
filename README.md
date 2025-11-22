# 📚 Sistema Biblioteca Digital

Sistema completo de gerenciamento de biblioteca com frontend e backend integrados.

## 🚀 Funcionalidades

### Página Pública
- ✅ Visualização de Autores, Livros, DVDs e CDs
- ✅ Busca em tempo real
- ✅ Modal de detalhes
- ✅ Design responsivo

### Área Administrativa
- ✅ Login/Cadastro de administradores
- ✅ CRUD completo para todas as entidades
- ✅ Interface intuitiva para gerenciamento
- ✅ Proteção de rotas com autenticação

## 🛠️ Tecnologias

### Frontend
- HTML5, CSS3, JavaScript Vanilla
- Design responsivo com CSS Grid/Flexbox
- Consumo de API REST

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT para autenticação
- bcryptjs para hash de senhas

## 🚀 Deploy no Render.com

### Configuração Única (Full Stack)
O projeto está configurado como **aplicação full-stack** onde frontend e backend rodam juntos:

1. **Web Service** no Render.com
2. **Root Directory**: `backend` (contém o server.js que serve frontend + API)
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### Variáveis de Ambiente
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/biblioteca
JWT_SECRET=seu-jwt-secret-super-seguro-aqui-2024
NODE_ENV=production
PORT=5000

```

## 👤 Usuário Demo

**Email**: admin@biblioteca.com  
**Senha**: 123456

## 🎯 Como Usar

1. **Como visitante**: Acesse a página pública para visualizar o acervo
2. **Como administrador**: 
   - Faça login em `/login.html`
   - Gerencie o acervo na área administrativa
   - Adicione, edite ou exclua itens

## 🌐 URL de Produção

**Aplicação Completa**: https://catalogodw.onrender.com

### URLs específicas:
- **Página Principal**: https://catalogodw.onrender.com/
- **Área Admin**: https://catalogodw.onrender.com/admin.html
- **Login**: https://catalogodw.onrender.com/login.html
- **API Health**: https://catalogodw.onrender.com/api/health

## 📁 Estrutura do Projeto

```
CatalogoDW/
├── backend/           # Servidor Node.js + Express
│   ├── src/          # Código fonte do backend
│   ├── server.js     # Servidor principal (frontend + backend)
│   └── package.json
├── frontend/         # Interface do usuário
│   ├── index.html    # Página pública
│   ├── admin.html    # Painel administrativo
│   ├── login.html    # Tela de login
│   ├── css/          # Estilos
│   └── js/           # JavaScript do frontend
└── README.md
```

## 🔧 Desenvolvimento Local

```bash
# Backend + Frontend
cd backend
npm start

# Acesse: http://localhost:5000
```

## 📄 Licença

Este projeto é para fins educacionais.
