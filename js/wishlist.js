// =====================================
// js/wishlist.js - Wishlist Functionality
// =====================================

let currentWishlist = [];
let currentFilter = 'all';

// Initialize wishlist
async function initWishlist() {
    console.log('⭐ Initializing wishlist...');
    setupWishlistEventListeners();
    await loadWishlist();
}

// Setup event listeners
function setupWishlistEventListeners() {
    // Priority filters
    document.querySelectorAll('.priority-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const priority = e.target.dataset.priority;
            filterWishlistByPriority(priority);
        });
    });
    
    // Add wishlist form
    const addWishlistForm = document.getElementById('addWishlistForm');
    if (addWishlistForm) {
        addWishlistForm.addEventListener('submit', handleAddWishlist);
    }
}

// Load wishlist items
async function loadWishlist(memberId = null) {
    try {
        showLoading();
        
        const params = {};
        if (memberId) params.id_membro = memberId;
        
        const items = await api.getWishlist(params);
        currentWishlist = items;
        
        displayWishlist(items);
        await loadWishlistSuggestions();
    } catch (error) {
        console.error('Error loading wishlist:', error);
        showToast('Erro ao carregar lista de desejos', 'error');
    } finally {
        hideLoading();
    }
}

// Display wishlist items
function displayWishlist(items) {
    const container = document.getElementById('wishlistGrid');
    if (!container) return;
    
    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">⭐</span>
                <p>Nenhum item na lista de desejos</p>
                <button class="btn-primary" onclick="showAddWishlistModal()">
                    Adicionar Primeiro Desejo
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    items.forEach(item => {
        const wishlistCard = createWishlistCard(item);
        container.appendChild(wishlistCard);
    });
}

// Create wishlist card element
function createWishlistCard(item) {
    const card = document.createElement('div');
    card.className = 'wishlist-card';
    card.dataset.wishlistId = item.id_wishlist;
    
    const priorityBadge = getPriorityBadge(item.prioridade);
    const bookTitle = item.titulo_livro || item.titulo_desejado || 'Sem título';
    const bookAuthor = item.autor_livro || item.autor_desejado || 'Autor desconhecido';
    
    card.innerHTML = `
        <div class="wishlist-card-header">
            ${priorityBadge}
            <div class="wishlist-actions">
                <button class="btn-icon" onclick="editWishlistItem(${item.id_wishlist})" title="Editar">
                    ✏️
                </button>
                <button class="btn-icon" onclick="markAsPurchased(${item.id_wishlist})" title="Marcar como comprado">
                    ✅
                </button>
                <button class="btn-icon danger" onclick="removeFromWishlist(${item.id_wishlist})" title="Remover">
                    🗑️
                </button>
            </div>
        </div>
        
        <div class="wishlist-card-body">
            <h3 class="wishlist-title">${bookTitle}</h3>
            <p class="wishlist-author">${bookAuthor}</p>
            
            ${item.notas ? `
                <div class="wishlist-notes">
                    <small>📝 ${item.notas}</small>
                </div>
            ` : ''}
            
            <div class="wishlist-meta">
                <span class="wishlist-member">
                    👤 ${item.nome_membro || 'Desconhecido'}
                </span>
                <span class="wishlist-date">
                    📅 ${formatDate(item.data_adicao)}
                </span>
            </div>
        </div>
    `;
    
    return card;
}

// Filter wishlist by priority
function filterWishlistByPriority(priority) {
    currentFilter = priority;
    
    // Update active button
    document.querySelectorAll('.priority-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.priority === priority) {
            btn.classList.add('active');
        }
    });
    
    // Filter items
    let filtered = currentWishlist;
    if (priority !== 'all') {
        filtered = currentWishlist.filter(item => item.prioridade === priority);
    }
    
    displayWishlist(filtered);
}

// Show add wishlist modal
window.showAddWishlistModal = async function() {
    openModal('addWishlistModal');
    await loadBooksForWishlist();
    await loadMembersForWishlist();
};

// Load books for wishlist modal
async function loadBooksForWishlist() {
    try {
        const books = await api.getBooks();
        const select = document.getElementById('wishlistBook');
        
        if (!select) return;
        
        select.innerHTML = '<option value="">Livro não cadastrado</option>';
        
        books.forEach(book => {
            const option = document.createElement('option');
            option.value = book.id_livro;
            option.textContent = `${book.titulo} - ${book.autor}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading books for wishlist:', error);
    }
}

// Load members for wishlist modal
async function loadMembersForWishlist() {
    try {
        const members = await api.getMembers();
        const select = document.getElementById('wishlistMember');
        
        if (!select) return;
        
        select.innerHTML = '<option value="">Selecione...</option>';
        
        members.forEach(member => {
            if (member.ativo) {
                const option = document.createElement('option');
                option.value = member.id_membro;
                option.textContent = member.nome;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading members for wishlist:', error);
    }
}

// Handle add wishlist form submission
async function handleAddWishlist(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = formDataToObject(formData);
    
    // Validate
    if (!data.id_membro) {
        showToast('Selecione um membro', 'error');
        return;
    }
    
    if (!data.id_livro && !data.titulo_desejado) {
        showToast('Selecione um livro ou informe o título desejado', 'error');
        return;
    }
    
    try {
        showLoading();
        
        // Prepare data
        const wishlistData = {
            id_membro: parseInt(data.id_membro),
            prioridade: data.prioridade || 'média',
            notas: data.notas
        };
        
        if (data.id_livro) {
            wishlistData.id_livro = parseInt(data.id_livro);
        } else {
            wishlistData.titulo_desejado = data.titulo_desejado;
            wishlistData.autor_desejado = data.autor_desejado;
        }
        
        await api.addToWishlist(wishlistData);
        
        showToast(SUCCESS_MESSAGES.WISHLIST_ADDED);
        closeModal('addWishlistModal');
        await loadWishlist();
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        showToast(error.message || ERROR_MESSAGES.GENERIC, 'error');
    } finally {
        hideLoading();
    }
}

// Edit wishlist item
window.editWishlistItem = async function(id) {
    try {
        const item = currentWishlist.find(w => w.id_wishlist === id);
        if (!item) return;
        
        // Open modal with item data
        openModal('editWishlistModal');
        
        // Populate form
        document.getElementById('editWishlistId').value = item.id_wishlist;
        document.getElementById('editWishlistPriority').value = item.prioridade;
        document.getElementById('editWishlistNotes').value = item.notas || '';
        
    } catch (error) {
        console.error('Error editing wishlist item:', error);
        showToast('Erro ao editar item', 'error');
    }
};

// Mark item as purchased
window.markAsPurchased = async function(id) {
    if (!confirm('Marcar este item como comprado?')) return;
    
    try {
        showLoading();
        
        await api.markWishlistAsPurchased(id);
        
        showToast('Item marcado como comprado e adicionado ao catálogo!', 'success');
        await loadWishlist();
    } catch (error) {
        console.error('Error marking as purchased:', error);
        showToast('Erro ao marcar como comprado', 'error');
    } finally {
        hideLoading();
    }
};

// Remove from wishlist
window.removeFromWishlist = async function(id) {
    if (!confirm('Remover este item da lista de desejos?')) return;
    
    try {
        showLoading();
        
        await api.deleteFromWishlist(id);
        
        showToast('Item removido da lista de desejos', 'success');
        await loadWishlist();
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        showToast('Erro ao remover item', 'error');
    } finally {
        hideLoading();
    }
};

// Load wishlist suggestions (books wanted by multiple members)
async function loadWishlistSuggestions() {
    try {
        const suggestions = await api.getWishlistSuggestions();
        
        if (suggestions && suggestions.length > 0) {
            displaySuggestions(suggestions);
        }
    } catch (error) {
        console.error('Error loading suggestions:', error);
    }
}

// Display wishlist suggestions
function displaySuggestions(suggestions) {
    const container = document.getElementById('wishlistSuggestions');
    if (!container) return;
    
    container.innerHTML = `
        <h3>📚 Livros Mais Desejados</h3>
        <div class="suggestions-list">
            ${suggestions.map(book => `
                <div class="suggestion-item">
                    <div class="suggestion-info">
                        <strong>${book.titulo}</strong>
                        <small>por ${book.autor || 'Autor desconhecido'}</small>
                    </div>
                    <div class="suggestion-stats">
                        <span class="interested-count">
                            👥 ${book.total_interessados} interessados
                        </span>
                        <small>${book.membros.join(', ')}</small>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Toggle wishlist book type
window.toggleWishlistBookType = function() {
    const bookSelect = document.getElementById('wishlistBook');
    const newBookFields = document.getElementById('newBookFields');
    
    if (bookSelect.value) {
        // Existing book selected
        newBookFields.style.display = 'none';
        document.getElementById('wishlistNewTitle').required = false;
    } else {
        // New book
        newBookFields.style.display = 'block';
        document.getElementById('wishlistNewTitle').required = true;
    }
};

// Export functions
window.wishlist = {
    init: initWishlist,
    load: loadWishlist,
    filter: filterWishlistByPriority,
    add: handleAddWishlist,
    edit: editWishlistItem,
    markPurchased: markAsPurchased,
    remove: removeFromWishlist
};

console.log('✅ Wishlist module loaded');