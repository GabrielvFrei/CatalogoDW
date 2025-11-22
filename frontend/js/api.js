// Configuração automática da URL da API
const getApiBase = () => {
	// CORREÇÃO: URL relativa - funciona em qualquer ambiente
	return '/api';
};

const API_BASE = getApiBase();
// console.log('Conectando à API:', API_BASE);

class API {
	constructor() {
		this.token = localStorage.getItem('adminToken');
		this.baseURL = API_BASE;
	}

	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`;
	// console.log('Fazendo request para:', url); // Depuração (remova em produção)
		
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
			...options
		};

		if (this.token) {
			config.headers.Authorization = `Bearer ${this.token}`;
		}

		try {
			const response = await fetch(url, config);
            
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Erro ${response.status}: ${errorText}`);
			}
            
			return await response.json();
		} catch (error) {
			console.error('❌ Erro na API:', error);
			throw new Error('Erro de conexão com o servidor. Tente novamente.');
		}
	}

	// Métodos de autenticação
	async login(email, password) {
		return this.request('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});
	}

	async register(nome, email, password) {
		return this.request('/auth/register', {
			method: 'POST',
			body: JSON.stringify({ nome, email, password })
		});
	}

	// Métodos GET (públicos)
	async getAutores() {
		return this.request('/autores');
	}

	async getLivros() {
		return this.request('/livros');
	}

	async getDVDs() {
		return this.request('/dvds');
	}

	async getCDs() {
		return this.request('/cds');
	}

	// Métodos POST (protegidos)
	async createAutor(autor) {
		return this.request('/autores', {
			method: 'POST',
			body: JSON.stringify(autor)
		});
	}

	async updateAutor(id, autor) {
		return this.request(`/autores/${id}`, {
			method: 'PUT',
			body: JSON.stringify(autor)
		});
	}

	async deleteAutor(id) {
		return this.request(`/autores/${id}`, {
			method: 'DELETE'
		});
	}

	async createLivro(livro) {
		return this.request('/livros', {
			method: 'POST',
			body: JSON.stringify(livro)
		});
	}

	async updateLivro(id, livro) {
		return this.request(`/livros/${id}`, {
			method: 'PUT',
			body: JSON.stringify(livro)
		});
	}

	async deleteLivro(id) {
		return this.request(`/livros/${id}`, {
			method: 'DELETE'
		});
	}

	async createDVD(dvd) {
		return this.request('/dvds', {
			method: 'POST',
			body: JSON.stringify(dvd)
		});
	}

	async updateDVD(id, dvd) {
		return this.request(`/dvds/${id}`, {
			method: 'PUT',
			body: JSON.stringify(dvd)
		});
	}

	async deleteDVD(id) {
		return this.request(`/dvds/${id}`, {
			method: 'DELETE'
		});
	}

	async createCD(cd) {
		return this.request('/cds', {
			method: 'POST',
			body: JSON.stringify(cd)
		});
	}

	async updateCD(id, cd) {
		return this.request(`/cds/${id}`, {
			method: 'PUT',
			body: JSON.stringify(cd)
		});
	}

	async deleteCD(id) {
		return this.request(`/cds/${id}`, {
			method: 'DELETE'
		});
	}

	// Setters
	setToken(token) {
		this.token = token;
		localStorage.setItem('adminToken', token);
	}

	removeToken() {
		this.token = null;
		localStorage.removeItem('adminToken');
	}

	isAuthenticated() {
		return !!this.token;
	}
}

const api = new API();