let currentEditId = null;
let currentSection = null;

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    setupNavigation();
    loadAdminData();
    setupModals();
    setupLogout();
});

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // Atualizar botões ativos
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar seção correspondente
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');
            
            currentSection = tab;
        });
    });
}

async function loadAdminData() {
    try {
        await Promise.all([
            loadAdminAutores(),
            loadAdminLivros(),
            loadAdminDVDs(),
            loadAdminCDs()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dados administrativos:', error);
        alert('❌ Erro ao carregar dados. Verifique sua conexão.');
    }
}

async function loadAdminAutores() {
    try {
        const result = await api.getAutores();
        renderAdminAutores(result.data);
    } catch (error) {
        console.error('Erro ao carregar autores:', error);
    }
}

async function loadAdminLivros() {
    try {
        const result = await api.getLivros();
        renderAdminLivros(result.data);
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
    }
}

async function loadAdminDVDs() {
    try {
        const result = await api.getDVDs();
        renderAdminDVDs(result.data);
    } catch (error) {
        console.error('Erro ao carregar DVDs:', error);
    }
}

async function loadAdminCDs() {
    try {
        const result = await api.getCDs();
        renderAdminCDs(result.data);
    } catch (error) {
        console.error('Erro ao carregar CDs:', error);
    }
}

function renderAdminAutores(autores) {
    const container = document.getElementById('autores-admin-list');
    if (!container) return;
    
    container.innerHTML = autores.map(autor => `
        <div class="admin-item">
            <div class="admin-item-content">
                <h4>${autor.nome}</h4>
                <p>${autor.nacionalidade} • Nascimento: ${autor.anoNascimento}</p>
            </div>
            <div class="admin-item-actions">
                <button class="btn-edit" onclick="editAutor('${autor._id}')">Editar</button>
                <button class="btn-delete" onclick="confirmDelete('autor', '${autor._id}', '${autor.nome}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

function renderAdminLivros(livros) {
    const container = document.getElementById('livros-admin-list');
    if (!container) return;
    
    container.innerHTML = livros.map(livro => `
        <div class="admin-item">
            <div class="admin-item-content">
                <h4>${livro.titulo}</h4>
                <p>ISBN: ${livro.isbn} • ${livro.anoPublicacao} • ${livro.numeroPaginas} páginas</p>
                ${livro.autor ? `<p><strong>Autor:</strong> ${livro.autor.nome}</p>` : ''}
            </div>
            <div class="admin-item-actions">
                <button class="btn-edit" onclick="editLivro('${livro._id}')">Editar</button>
                <button class="btn-delete" onclick="confirmDelete('livro', '${livro._id}', '${livro.titulo}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

function renderAdminDVDs(dvds) {
    const container = document.getElementById('dvds-admin-list');
    if (!container) return;
    
    container.innerHTML = dvds.map(dvd => `
        <div class="admin-item">
            <div class="admin-item-content">
                <h4>${dvd.titulo}</h4>
                <p>${dvd.diretor} • ${dvd.anoLancamento} • ${dvd.duracao}min</p>
                ${dvd.autor ? `<p><strong>Autor:</strong> ${dvd.autor.nome}</p>` : ''}
            </div>
            <div class="admin-item-actions">
                <button class="btn-edit" onclick="editDVD('${dvd._id}')">Editar</button>
                <button class="btn-delete" onclick="confirmDelete('dvd', '${dvd._id}', '${dvd.titulo}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

function renderAdminCDs(cds) {
    const container = document.getElementById('cds-admin-list');
    if (!container) return;
    
    container.innerHTML = cds.map(cd => `
        <div class="admin-item">
            <div class="admin-item-content">
                <h4>${cd.titulo}</h4>
                <p>${cd.artista} • ${cd.anoLancamento} • ${cd.numeroFaixas} faixas</p>
                ${cd.autor ? `<p><strong>Autor:</strong> ${cd.autor.nome}</p>` : ''}
            </div>
            <div class="admin-item-actions">
                <button class="btn-edit" onclick="editCD('${cd._id}')">Editar</button>
                <button class="btn-delete" onclick="confirmDelete('cd', '${cd._id}', '${cd.titulo}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

// Funções para abrir formulários
function openAutorForm(autor = null) {
    currentEditId = autor ? autor._id : null;
    const modalBody = document.getElementById('form-modal-body');
    
    modalBody.innerHTML = `
        <h3>${currentEditId ? 'Editar' : 'Novo'} Autor</h3>
        <form id="autor-form">
            <div class="form-group">
                <label for="autor-nome">Nome:</label>
                <input type="text" id="autor-nome" value="${autor ? autor.nome : ''}" required>
            </div>
            <div class="form-group">
                <label for="autor-nacionalidade">Nacionalidade:</label>
                <input type="text" id="autor-nacionalidade" value="${autor ? autor.nacionalidade : ''}" required>
            </div>
            <div class="form-group">
                <label for="autor-anoNascimento">Ano de Nascimento:</label>
                <input type="number" id="autor-anoNascimento" value="${autor ? autor.anoNascimento : ''}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeFormModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar</button>
            </div>
        </form>
    `;

    document.getElementById('autor-form').addEventListener('submit', handleAutorSubmit);
    document.getElementById('form-modal').style.display = 'block';
}

function openLivroForm(livro = null) {
    currentEditId = livro ? livro._id : null;
    const modalBody = document.getElementById('form-modal-body');
    
    modalBody.innerHTML = `
        <h3>${currentEditId ? 'Editar' : 'Novo'} Livro</h3>
        <form id="livro-form">
            <div class="form-group">
                <label for="livro-titulo">Título:</label>
                <input type="text" id="livro-titulo" value="${livro ? livro.titulo : ''}" required>
            </div>
            <div class="form-group">
                <label for="livro-isbn">ISBN:</label>
                <input type="text" id="livro-isbn" value="${livro ? livro.isbn : ''}" required>
            </div>
            <div class="form-group">
                <label for="livro-anoPublicacao">Ano de Publicação:</label>
                <input type="number" id="livro-anoPublicacao" value="${livro ? livro.anoPublicacao : ''}" required>
            </div>
            <div class="form-group">
                <label for="livro-numeroPaginas">Número de Páginas:</label>
                <input type="number" id="livro-numeroPaginas" value="${livro ? livro.numeroPaginas : ''}" required>
            </div>
            <div class="form-group">
                <label for="livro-autor">Autor:</label>
                <select id="livro-autor" required>
                    <option value="">Selecione um autor</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeFormModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar</button>
            </div>
        </form>
    `;

    loadAutoresForSelect('livro-autor', livro ? livro.autor?._id : '');
    document.getElementById('livro-form').addEventListener('submit', handleLivroSubmit);
    document.getElementById('form-modal').style.display = 'block';
}

function openDVDForm(dvd = null) {
    currentEditId = dvd ? dvd._id : null;
    const modalBody = document.getElementById('form-modal-body');
    
    modalBody.innerHTML = `
        <h3>${currentEditId ? 'Editar' : 'Novo'} DVD</h3>
        <form id="dvd-form">
            <div class="form-group">
                <label for="dvd-titulo">Título:</label>
                <input type="text" id="dvd-titulo" value="${dvd ? dvd.titulo : ''}" required>
            </div>
            <div class="form-group">
                <label for="dvd-duracao">Duração (minutos):</label>
                <input type="number" id="dvd-duracao" value="${dvd ? dvd.duracao : ''}" required>
            </div>
            <div class="form-group">
                <label for="dvd-anoLancamento">Ano de Lançamento:</label>
                <input type="number" id="dvd-anoLancamento" value="${dvd ? dvd.anoLancamento : ''}" required>
            </div>
            <div class="form-group">
                <label for="dvd-diretor">Diretor:</label>
                <input type="text" id="dvd-diretor" value="${dvd ? dvd.diretor : ''}" required>
            </div>
            <div class="form-group">
                <label for="dvd-autor">Autor:</label>
                <select id="dvd-autor" required>
                    <option value="">Selecione um autor</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeFormModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar</button>
            </div>
        </form>
    `;

    loadAutoresForSelect('dvd-autor', dvd ? dvd.autor?._id : '');
    document.getElementById('dvd-form').addEventListener('submit', handleDVDSubmit);
    document.getElementById('form-modal').style.display = 'block';
}

function openCDForm(cd = null) {
    currentEditId = cd ? cd._id : null;
    const modalBody = document.getElementById('form-modal-body');
    
    modalBody.innerHTML = `
        <h3>${currentEditId ? 'Editar' : 'Novo'} CD</h3>
        <form id="cd-form">
            <div class="form-group">
                <label for="cd-titulo">Título:</label>
                <input type="text" id="cd-titulo" value="${cd ? cd.titulo : ''}" required>
            </div>
            <div class="form-group">
                <label for="cd-artista">Artista:</label>
                <input type="text" id="cd-artista" value="${cd ? cd.artista : ''}" required>
            </div>
            <div class="form-group">
                <label for="cd-anoLancamento">Ano de Lançamento:</label>
                <input type="number" id="cd-anoLancamento" value="${cd ? cd.anoLancamento : ''}" required>
            </div>
            <div class="form-group">
                <label for="cd-numeroFaixas">Número de Faixas:</label>
                <input type="number" id="cd-numeroFaixas" value="${cd ? cd.numeroFaixas : ''}" required>
            </div>
            <div class="form-group">
                <label for="cd-autor">Autor:</label>
                <select id="cd-autor" required>
                    <option value="">Selecione um autor</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeFormModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar</button>
            </div>
        </form>
    `;

    loadAutoresForSelect('cd-autor', cd ? cd.autor?._id : '');
    document.getElementById('cd-form').addEventListener('submit', handleCDSubmit);
    document.getElementById('form-modal').style.display = 'block';
}

function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function closeFormModal() {
    document.getElementById('form-modal').style.display = 'none';
    currentEditId = null;
}

function setupLogout() {
    document.getElementById('logout-btn').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja sair?')) {
            api.removeToken();
            window.location.href = 'login.html';
        }
    });
}

// Handlers de formulários
async function handleAutorSubmit(e) {
    e.preventDefault();
    
    const autor = {
        nome: document.getElementById('autor-nome').value,
        nacionalidade: document.getElementById('autor-nacionalidade').value,
        anoNascimento: parseInt(document.getElementById('autor-anoNascimento').value)
    };

    try {
        if (currentEditId) {
            await api.updateAutor(currentEditId, autor);
        } else {
            await api.createAutor(autor);
        }
        
        closeFormModal();
        loadAdminAutores();
    } catch (error) {
        alert('❌ Erro ao salvar autor: ' + error.message);
    }
}

async function handleLivroSubmit(e) {
    e.preventDefault();
    
    const livro = {
        titulo: document.getElementById('livro-titulo').value,
        isbn: document.getElementById('livro-isbn').value,
        anoPublicacao: parseInt(document.getElementById('livro-anoPublicacao').value),
        numeroPaginas: parseInt(document.getElementById('livro-numeroPaginas').value),
        autor: document.getElementById('livro-autor').value
    };

    try {
        if (currentEditId) {
            await api.updateLivro(currentEditId, livro);
        } else {
            await api.createLivro(livro);
        }
        
        closeFormModal();
        loadAdminLivros();
    } catch (error) {
        alert('❌ Erro ao salvar livro: ' + error.message);
    }
}

async function handleDVDSubmit(e) {
    e.preventDefault();
    
    const dvd = {
        titulo: document.getElementById('dvd-titulo').value,
        duracao: parseInt(document.getElementById('dvd-duracao').value),
        anoLancamento: parseInt(document.getElementById('dvd-anoLancamento').value),
        diretor: document.getElementById('dvd-diretor').value,
        autor: document.getElementById('dvd-autor').value
    };

    try {
        if (currentEditId) {
            await api.updateDVD(currentEditId, dvd);
        } else {
            await api.createDVD(dvd);
        }
        
        closeFormModal();
        loadAdminDVDs();
    } catch (error) {
        alert('❌ Erro ao salvar DVD: ' + error.message);
    }
}

async function handleCDSubmit(e) {
    e.preventDefault();
    
    const cd = {
        titulo: document.getElementById('cd-titulo').value,
        artista: document.getElementById('cd-artista').value,
        anoLancamento: parseInt(document.getElementById('cd-anoLancamento').value),
        numeroFaixas: parseInt(document.getElementById('cd-numeroFaixas').value),
        autor: document.getElementById('cd-autor').value
    };

    try {
        if (currentEditId) {
            await api.updateCD(currentEditId, cd);
        } else {
            await api.createCD(cd);
        }
        
        closeFormModal();
        loadAdminCDs();
    } catch (error) {
        alert('❌ Erro ao salvar CD: ' + error.message);
    }
}

// Funções de edição
async function editAutor(id) {
    try {
        const result = await api.getAutores();
        const autor = result.data.find(a => a._id === id);
        if (autor) {
            openAutorForm(autor);
        }
    } catch (error) {
        alert('❌ Erro ao carregar autor: ' + error.message);
    }
}

async function editLivro(id) {
    try {
        const result = await api.getLivros();
        const livro = result.data.find(l => l._id === id);
        if (livro) {
            openLivroForm(livro);
        }
    } catch (error) {
        alert('❌ Erro ao carregar livro: ' + error.message);
    }
}

async function editDVD(id) {
    try {
        const result = await api.getDVDs();
        const dvd = result.data.find(d => d._id === id);
        if (dvd) {
            openDVDForm(dvd);
        }
    } catch (error) {
        alert('❌ Erro ao carregar DVD: ' + error.message);
    }
}

async function editCD(id) {
    try {
        const result = await api.getCDs();
        const cd = result.data.find(c => c._id === id);
        if (cd) {
            openCDForm(cd);
        }
    } catch (error) {
        alert('❌ Erro ao carregar CD: ' + error.message);
    }
}

// Função de confirmação de exclusão
function confirmDelete(type, id, name) {
    const modal = document.getElementById('confirm-modal');
    const message = document.getElementById('confirm-message');
    
    message.textContent = `Tem certeza que deseja excluir "${name}"?`;
    
    const confirmBtn = document.getElementById('confirm-ok');
    const cancelBtn = document.getElementById('confirm-cancel');
    
    // Remover event listeners anteriores
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    
    // Novos event listeners
    document.getElementById('confirm-ok').onclick = () => deleteItem(type, id);
    document.getElementById('confirm-cancel').onclick = () => {
        document.getElementById('confirm-modal').style.display = 'none';
    };
    
    modal.style.display = 'block';
}

async function deleteItem(type, id) {
    try {
        switch (type) {
            case 'autor':
                await api.deleteAutor(id);
                loadAdminAutores();
                break;
            case 'livro':
                await api.deleteLivro(id);
                loadAdminLivros();
                break;
            case 'dvd':
                await api.deleteDVD(id);
                loadAdminDVDs();
                break;
            case 'cd':
                await api.deleteCD(id);
                loadAdminCDs();
                break;
        }
        
        document.getElementById('confirm-modal').style.display = 'none';
    } catch (error) {
        alert('❌ Erro ao excluir: ' + error.message);
    }
}

// Carregar autores para selects
async function loadAutoresForSelect(selectId, selectedId = '') {
    try {
        const result = await api.getAutores();
        const select = document.getElementById(selectId);
        
        if (select) {
            select.innerHTML = '<option value="">Selecione um autor</option>' +
                result.data.map(autor => 
                    `<option value="${autor._id}" ${autor._id === selectedId ? 'selected' : ''}>${autor.nome}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar autores:', error);
    }
}
