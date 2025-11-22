document.addEventListener('DOMContentLoaded', function() {
	const loginForm = document.getElementById('login-form');
	const registerForm = document.getElementById('register-form');
	const loginCard = document.querySelector('.auth-card');
	const registerCard = document.getElementById('register-card');
	const showRegister = document.getElementById('show-register');
	const showLogin = document.getElementById('show-login');
	const messageDiv = document.getElementById('auth-message');

	// Alternar entre login e registro
	showRegister?.addEventListener('click', function(e) {
		e.preventDefault();
		loginCard.style.display = 'none';
		registerCard.style.display = 'block';
	});

	showLogin?.addEventListener('click', function(e) {
		e.preventDefault();
		registerCard.style.display = 'none';
		loginCard.style.display = 'block';
	});

	// Login
	loginForm?.addEventListener('submit', async function(e) {
		e.preventDefault();
        
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;

		try {
			showMessage('🔐 Fazendo login...', 'success');
            
			const result = await api.login(email, password);
			showMessage('✅ Login realizado com sucesso!', 'success');
            
			api.setToken(result.token);
            
			// Redirecionar para admin após 1 segundo
			setTimeout(() => {
				window.location.href = 'admin.html';
			}, 1000);
            
		} catch (error) {
			showMessage('❌ ' + error.message, 'error');
		}
	});

	// Registro
	registerForm?.addEventListener('submit', async function(e) {
		e.preventDefault();
        
		const nome = document.getElementById('reg-nome').value;
		const email = document.getElementById('reg-email').value;
		const password = document.getElementById('reg-password').value;

		try {
			showMessage('📝 Criando conta...', 'success');
            
			const result = await api.register(nome, email, password);
			showMessage('✅ Conta criada com sucesso! Faça login.', 'success');
            
			// Voltar para login
			setTimeout(() => {
				registerCard.style.display = 'none';
				loginCard.style.display = 'block';
				registerForm.reset();
			}, 2000);
            
		} catch (error) {
			showMessage('❌ ' + error.message, 'error');
		}
	});

	function showMessage(text, type) {
		if (!messageDiv) return;
        
		messageDiv.textContent = text;
		messageDiv.className = `message ${type}`;
		messageDiv.style.display = 'block';
        
		setTimeout(() => {
			messageDiv.style.display = 'none';
		}, 5000);
	}

	// Verificar se já está logado
	if (api.isAuthenticated() && window.location.pathname.includes('login.html')) {
		window.location.href = 'admin.html';
	}
});
