# 📚 Sistema Biblioteca Digital

Sistema completo de gerenciamento de biblioteca com frontend e backend.

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
- JWT para autenticação (versão simplificada no template)
- bcryptjs para hash de senhas

## 📦 Deploy no Vercel

### Backend
1. Crie um projeto no Vercel para a pasta `backend`
2. Configure as variáveis de ambiente:
   ```
   MONGODB_URI = mongodb+srv://usuario:senha@cluster.mongodb.net/biblioteca
   JWT_SECRET = seu-jwt-secret
   NODE_ENV = production
   ```

### Frontend
1. Crie um projeto no Vercel para a pasta `frontend`
2. Framework Preset: **Static**

## 👤 Usuário Demo

**Email**: admin@biblioteca.com
**Senha**: 123456

## 🎯 Como Usar

1. **Como visitante**: Acesse a página pública para visualizar o acervo
2. **Como administrador**: 
   - Faça login em `/login.html`
   - Gerencie o acervo na área administrativa
   - Adicione, edite ou exclua itens

## 🔗 URLs de Produção (exemplos)

- **Frontend**: `https://biblioteca-frontend.vercel.app`
- **Backend**: `https://biblioteca-backend.vercel.app`
- **API**: `https://biblioteca-backend.vercel.app/api`

## 📄 Licença

Este projeto é para fins educacionais.
