document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    setupSearch();
    setupModal();
});

async function loadAllData() {
    try {
        await Promise.all([
            loadAutores(),
            loadLivros(),
            loadDVDs(),
            loadCDs()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showError('global', 'Erro ao carregar dados do servidor');
    }
}

async function loadAutores() {
    showLoading('autores');
    try {
        const result = await api.getAutores();
        renderAutores(result.data);
    } catch (error) {
        showError('autores', error.message);
    } finally {
        hideLoading('autores');
    }
}

async function loadLivros() {
    showLoading('livros');
    try {
        const result = await api.getLivros();
        renderLivros(result.data);
    } catch (error) {
        showError('livros', error.message);
    } finally {
        hideLoading('livros');
    }
}

async function loadDVDs() {
    showLoading('dvds');
    try {
        const result = await api.getDVDs();
        renderDVDs(result.data);
    } catch (error) {
        showError('dvds', error.message);
    } finally {
        hideLoading('dvds');
    }
}

async function loadCDs() {
    showLoading('cds');
    try {
        const result = await api.getCDs();
        renderCDs(result.data);
    } catch (error) {
        showError('cds', error.message);
    } finally {
        hideLoading('cds');
    }
}

function renderAutores(autores) {
    const container = document.getElementById('autores-list');
    if (!container) return;
    
    container.innerHTML = autores.map(autor => `
        <div class="card" onclick="showAutorDetails('${autor._id}')">
            <h3>${autor.nome}</h3>
            <p>${autor.nacionalidade}</p>
            <div class="meta">Nascimento: ${autor.anoNascimento}</div>
        </div>
    `).join('');
}

function renderLivros(livros) {
    const container = document.getElementById('livros-list');
    if (!container) return;
    
    container.innerHTML = livros.map(livro => `
        <div class="card" onclick="showLivroDetails('${livro._id}')">
            <h3>${livro.titulo}</h3>
            <p>ISBN: ${livro.isbn}</p>
            <div class="meta">
                ${livro.anoPublicacao} • ${livro.numeroPaginas} páginas
                ${livro.autor ? `<br>Autor: ${livro.autor.nome}` : ''}
            </div>
        </div>
    `).join('');
}

function renderDVDs(dvds) {
    const container = document.getElementById('dvds-list');
    if (!container) return;
    
    container.innerHTML = dvds.map(dvd => `
        <div class="card" onclick="showDVDDetails('${dvd._id}')">
            <h3>${dvd.titulo}</h3>
            <p>Diretor: ${dvd.diretor}</p>
            <div class="meta">
                ${dvd.anoLancamento} • ${dvd.duracao} min
                ${dvd.autor ? `<br>Autor: ${dvd.autor.nome}` : ''}
            </div>
        </div>
    `).join('');
}

function renderCDs(cds) {
    const container = document.getElementById('cds-list');
    if (!container) return;
    
    container.innerHTML = cds.map(cd => `
        <div class="card" onclick="showCDDetails('${cd._id}')">
            <h3>${cd.titulo}</h3>
            <p>Artista: ${cd.artista}</p>
            <div class="meta">
                ${cd.anoLancamento} • ${cd.numeroFaixas} faixas
                ${cd.autor ? `<br>Autor: ${cd.autor.nome}` : ''}
            </div>
        </div>
    `).join('');
}

function setupSearch() {
    const searchInputs = document.querySelectorAll('.search-bar input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const section = this.id.replace('search-', '');
            filterItems(section, this.value);
        });
    });
}

function filterItems(section, searchTerm) {
    const items = document.querySelectorAll(`#${section}-list .card`);
    const term = searchTerm.toLowerCase();
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(term) ? 'block' : 'none';
    });
}

function setupModal() {
    const modal = document.getElementById('details-modal');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Funções de detalhes
async function showAutorDetails(id) {
    try {
        const result = await api.getAutores();
        const autor = result.data.find(a => a._id === id);
        
        if (autor) {
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <h2>${autor.nome}</h2>
                <p><strong>Nacionalidade:</strong> ${autor.nacionalidade}</p>
                <p><strong>Ano de Nascimento:</strong> ${autor.anoNascimento}</p>
            `;
            document.getElementById('details-modal').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do autor:', error);
    }
}

async function showLivroDetails(id) {
    try {
        const result = await api.getLivros();
        const livro = result.data.find(l => l._id === id);
        
        if (livro) {
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <h2>${livro.titulo}</h2>
                <p><strong>ISBN:</strong> ${livro.isbn}</p>
                <p><strong>Ano de Publicação:</strong> ${livro.anoPublicacao}</p>
                <p><strong>Número de Páginas:</strong> ${livro.numeroPaginas}</p>
                ${livro.autor ? `<p><strong>Autor:</strong> ${livro.autor.nome}</p>` : ''}
            `;
            document.getElementById('details-modal').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do livro:', error);
    }
}

async function showDVDDetails(id) {
    try {
        const result = await api.getDVDs();
        const dvd = result.data.find(d => d._id === id);
        
        if (dvd) {
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <h2>${dvd.titulo}</h2>
                <p><strong>Diretor:</strong> ${dvd.diretor}</p>
                <p><strong>Ano de Lançamento:</strong> ${dvd.anoLancamento}</p>
                <p><strong>Duração:</strong> ${dvd.duracao} minutos</p>
                ${dvd.autor ? `<p><strong>Autor:</strong> ${dvd.autor.nome}</p>` : ''}
            `;
            document.getElementById('details-modal').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do DVD:', error);
    }
}

async function showCDDetails(id) {
    try {
        const result = await api.getCDs();
        const cd = result.data.find(c => c._id === id);
        
        if (cd) {
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <h2>${cd.titulo}</h2>
                <p><strong>Artista:</strong> ${cd.artista}</p>
                <p><strong>Ano de Lançamento:</strong> ${cd.anoLancamento}</p>
                <p><strong>Número de Faixas:</strong> ${cd.numeroFaixas}</p>
                ${cd.autor ? `<p><strong>Autor:</strong> ${cd.autor.nome}</p>` : ''}
            `;
            document.getElementById('details-modal').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do CD:', error);
    }
}

function showLoading(section) {
    const element = document.getElementById(`${section}-loading`);
    if (element) element.style.display = 'block';
}

function hideLoading(section) {
    const element = document.getElementById(`${section}-loading`);
    if (element) element.style.display = 'none';
}

function showError(section, message) {
    const container = document.getElementById(`${section}-list`);
    if (container) {
        container.innerHTML = `<div class="error-message" style="text-align: center; color: var(--danger-color); padding: 2rem;">Erro ao carregar: ${message}</div>`;
    }
}
