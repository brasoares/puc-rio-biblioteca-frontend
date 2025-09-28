// =====================================
// js/dashboard.js - Dashboard Functionality
// =====================================

let dashboardData = {
    stats: null,
    lastUpdate: null
};

// Initialize dashboard
async function initDashboard() {
    console.log('📊 Initializing dashboard...');
    await loadDashboardStats();
    
    // Set up auto-refresh
    setInterval(loadDashboardStats, APP_CONSTANTS.DASHBOARD_REFRESH);
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        showLoading();
        
        // Check cache first
        const cached = getFromCache('dashboard_stats');
        if (cached && !isStatsOutdated()) {
            updateDashboardUI(cached);
            hideLoading();
            return;
        }
        
        // Fetch fresh data
        const stats = await api.getStatistics();
        dashboardData.stats = stats;
        dashboardData.lastUpdate = new Date();
        
        // Save to cache
        saveToCache('dashboard_stats', stats, 5);
        
        updateDashboardUI(stats);
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showToast('Erro ao carregar estatísticas', 'error');
    } finally {
        hideLoading();
    }
}

// Update dashboard UI with stats
function updateDashboardUI(stats) {
    if (!stats) return;
    
    // Update main statistics cards
    updateStatsCards(stats.resumo_geral);
    
    // Update rankings
    updateTopReaders(stats.rankings?.top_leitores);
    updatePopularBooks(stats.rankings?.livros_mais_emprestados);
    
    // Update additional metrics
    updateLoanMetrics(stats.leituras);
    
    // Update last sync time
    updateLastSyncTime();
}

// Update statistics cards
function updateStatsCards(summary) {
    if (!summary) return;
    
    // Total books
    const totalLivrosEl = document.getElementById('totalLivros');
    if (totalLivrosEl) {
        totalLivrosEl.textContent = summary.total_livros || 0;
    }
    
    // Available books
    const livrosDisponiveisEl = document.getElementById('livrosDisponiveis');
    if (livrosDisponiveisEl) {
        livrosDisponiveisEl.textContent = summary.livros_disponiveis || 0;
    }
    
    // Total members
    const totalMembrosEl = document.getElementById('totalMembros');
    if (totalMembrosEl) {
        totalMembrosEl.textContent = summary.total_membros || 0;
    }
    
    // Active loans
    const emprestimosAtivosEl = document.getElementById('emprestimosAtivos');
    if (emprestimosAtivosEl) {
        emprestimosAtivosEl.textContent = summary.livros_emprestados || 0;
    }
    
    // Add library value if element exists
    const valorTotalEl = document.getElementById('valorTotal');
    if (valorTotalEl && summary.valor_total_biblioteca) {
        valorTotalEl.textContent = formatCurrency(summary.valor_total_biblioteca);
    }
    
    // Add family classics count
    const classicosEl = document.getElementById('totalClassicos');
    if (classicosEl && summary.total_classicos_familia) {
        classicosEl.textContent = summary.total_classicos_familia;
    }
}

// Update top readers ranking
function updateTopReaders(topReaders) {
    const container = document.getElementById('topLeitores');
    if (!container || !topReaders) return;
    
    container.innerHTML = '';
    
    if (topReaders.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum leitor ainda</p>';
        return;
    }
    
    topReaders.forEach((reader, index) => {
        const position = index + 1;
        const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '🏅';
        const level = getReaderLevel(reader.pontos);
        
        const readerItem = document.createElement('div');
        readerItem.className = 'ranking-item';
        readerItem.innerHTML = `
            <div class="ranking-position">
                <span class="position-medal">${medal}</span>
                <span class="position-number">${position}º</span>
            </div>
            <div class="ranking-info">
                <div class="ranking-name">${reader.nome}</div>
                <div class="ranking-details">
                    <span class="reader-level" style="color: ${level.color}">
                        ${level.icon} ${level.name}
                    </span>
                    <span class="reader-points">${reader.pontos} pontos</span>
                </div>
            </div>
        `;
        
        container.appendChild(readerItem);
    });
}

// Update popular books ranking
function updatePopularBooks(popularBooks) {
    const container = document.getElementById('livrosPopulares');
    if (!container || !popularBooks) return;
    
    container.innerHTML = '';
    
    if (popularBooks.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum empréstimo ainda</p>';
        return;
    }
    
    popularBooks.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.className = 'ranking-item';
        bookItem.innerHTML = `
            <div class="ranking-position">
                <span class="position-number">${index + 1}º</span>
            </div>
            <div class="ranking-info">
                <div class="book-title">${truncateText(book.titulo, 40)}</div>
                <div class="book-author">${book.autor}</div>
                <div class="book-stats">
                    <span class="loan-count">📚 ${book.total} empréstimos</span>
                </div>
            </div>
        `;
        
        container.appendChild(bookItem);
    });
}

// Update loan metrics
function updateLoanMetrics(loanStats) {
    if (!loanStats) return;
    
    // Update reader of the month
    const leitorMesEl = document.getElementById('leitorDoMes');
    if (leitorMesEl && loanStats.leitor_do_mes) {
        leitorMesEl.innerHTML = `
            <div class="metric-card highlight">
                <div class="metric-label">📚 Leitor do Mês</div>
                <div class="metric-value">${loanStats.leitor_do_mes}</div>
            </div>
        `;
    }
    
    // Update most popular genre
    const generoPopularEl = document.getElementById('generoPopular');
    if (generoPopularEl && loanStats.genero_mais_popular) {
        generoPopularEl.innerHTML = `
            <div class="metric-card">
                <div class="metric-label">🎭 Gênero Mais Popular</div>
                <div class="metric-value">${loanStats.genero_mais_popular}</div>
            </div>
        `;
    }
    
    // Update books read this month
    const livrosMesEl = document.getElementById('livrosLidosMes');
    if (livrosMesEl) {
        livrosMesEl.innerHTML = `
            <div class="metric-card">
                <div class="metric-label">📖 Livros Lidos (30 dias)</div>
                <div class="metric-value">${loanStats.livros_lidos_ultimo_mes || 0}</div>
            </div>
        `;
    }
    
    // Update delay rate
    const taxaAtrasoEl = document.getElementById('taxaAtraso');
    if (taxaAtrasoEl && loanStats.taxa_atraso !== undefined) {
        const rateClass = loanStats.taxa_atraso > 20 ? 'warning' : 'success';
        taxaAtrasoEl.innerHTML = `
            <div class="metric-card ${rateClass}">
                <div class="metric-label">⏰ Taxa de Atraso</div>
                <div class="metric-value">${loanStats.taxa_atraso}%</div>
            </div>
        `;
    }
}

// Check if stats are outdated
function isStatsOutdated() {
    if (!dashboardData.lastUpdate) return true;
    
    const now = new Date();
    const diff = now - dashboardData.lastUpdate;
    const minutesDiff = diff / (1000 * 60);
    
    return minutesDiff > 5; // Consider outdated after 5 minutes
}

// Update last sync time display
function updateLastSyncTime() {
    const syncEl = document.getElementById('lastSync');
    if (!syncEl) return;
    
    const now = new Date();
    syncEl.textContent = `Última atualização: ${formatDateTime(now)}`;
}

// Quick action handlers
window.showAddBookModal = function() {
    openModal('addBookModal');
    // Load genres if needed
    loadGenresForSelect('bookGenre');
};

window.showAddMemberModal = function() {
    openModal('addMemberModal');
};

window.showLoanModal = async function() {
    openModal('loanModal');
    // Load available books and members
    await loadAvailableBooksForLoan();
    await loadMembersForLoan();
};

// Load available books for loan modal
async function loadAvailableBooksForLoan() {
    try {
        const books = await api.getBooks({ disponivel: true });
        const select = document.getElementById('loanBook');
        
        if (!select) return;
        
        // Clear current options
        select.innerHTML = '<option value="">Selecione...</option>';
        
        // Add book options
        books.forEach(book => {
            const option = document.createElement('option');
            option.value = book.id_livro;
            option.textContent = `${book.titulo} - ${book.autor}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading books for loan:', error);
    }
}

// Load members for loan modal
async function loadMembersForLoan() {
    try {
        const members = await api.getMembers();
        const select = document.getElementById('loanMember');
        
        if (!select) return;
        
        // Clear current options
        select.innerHTML = '<option value="">Selecione...</option>';
        
        // Add member options
        members.forEach(member => {
            if (member.ativo) {
                const option = document.createElement('option');
                option.value = member.id_membro;
                option.textContent = member.nome;
                if (member.apelido) {
                    option.textContent += ` (${member.apelido})`;
                }
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading members for loan:', error);
    }
}

// Load genres for select
function loadGenresForSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Clear current options
    select.innerHTML = '<option value="">Selecione...</option>';
    
    // Add genre options
    BOOK_GENRES.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        select.appendChild(option);
    });
}

// Toggle loan type fields
window.toggleLoanType = function() {
    const loanType = document.getElementById('loanType').value;
    const internalFields = document.getElementById('internalLoan');
    const externalFields = document.getElementById('externalLoan');
    
    if (loanType === 'interno') {
        internalFields.style.display = 'block';
        externalFields.style.display = 'none';
        // Make internal fields required
        document.getElementById('loanMember').required = true;
        document.getElementById('friendName').required = false;
    } else {
        internalFields.style.display = 'none';
        externalFields.style.display = 'block';
        // Make external fields required
        document.getElementById('loanMember').required = false;
        document.getElementById('friendName').required = true;
    }
};

// Export functions
window.dashboard = {
    init: initDashboard,
    refresh: loadDashboardStats,
    updateUI: updateDashboardUI
};

console.log('✅ Dashboard module loaded');