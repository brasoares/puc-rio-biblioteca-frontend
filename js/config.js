// =====================================
// js/config.js - Configuration & Constants
// =====================================

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // 1 second
};

// Application Constants
const APP_CONSTANTS = {
    // Pagination
    ITEMS_PER_PAGE: 12,
    
    // Refresh intervals (milliseconds)
    DASHBOARD_REFRESH: 30000, // 30 seconds
    LOANS_REFRESH: 60000, // 1 minute
    
    // Cache duration (milliseconds)
    CACHE_DURATION: 300000, // 5 minutes
    
    // Toast notification duration (milliseconds)
    TOAST_DURATION: 3000,
    
    // Debounce delays (milliseconds)
    SEARCH_DEBOUNCE: 300,
    FILTER_DEBOUNCE: 200
};

// Book Genres
const BOOK_GENRES = [
    'Ficção',
    'Fantasia',
    'Romance',
    'Aventura',
    'Biografia',
    'História',
    'Infantil',
    'Terror',
    'Poesia',
    'Técnico',
    'Autoajuda',
    'Suspense',
    'Drama',
    'Humor',
    'Ciência'
];

// Member Types
const MEMBER_TYPES = {
    membro: 'Membro',
    administrador: 'Administrador',
    crianca: 'Criança'
};

// Priority Levels
const PRIORITY_LEVELS = {
    baixa: { label: 'Baixa', color: '#10B981', icon: '🟢' },
    média: { label: 'Média', color: '#F59E0B', icon: '🟡' },
    alta: { label: 'Alta', color: '#EF4444', icon: '🔴' }
};

// Reader Levels (Gamification)
const READER_LEVELS = [
    { name: 'Iniciante', minPoints: 0, maxPoints: 99, color: '#6B7280', icon: '📖' },
    { name: 'Leitor', minPoints: 100, maxPoints: 499, color: '#3B82F6', icon: '📚' },
    { name: 'Bookworm', minPoints: 500, maxPoints: 999, color: '#8B5CF6', icon: '🐛' },
    { name: 'Mestre dos Livros', minPoints: 1000, maxPoints: Infinity, color: '#F59E0B', icon: '👑' }
];

// Age Recommendations
const AGE_RECOMMENDATIONS = [
    { value: 'Todas', label: 'Todas as idades' },
    { value: '10+', label: '10+ anos' },
    { value: '14+', label: '14+ anos' },
    { value: '18+', label: '18+ anos' }
];

// Book Conservation States
const CONSERVATION_STATES = [
    { value: 'Novo', label: 'Novo', color: '#10B981' },
    { value: 'Bom', label: 'Bom', color: '#3B82F6' },
    { value: 'Regular', label: 'Regular', color: '#F59E0B' },
    { value: 'Ruim', label: 'Ruim', color: '#EF4444' }
];

// Loan Status
const LOAN_STATUS = {
    ativo: { label: 'Ativo', color: '#3B82F6', icon: '📤' },
    devolvido: { label: 'Devolvido', color: '#10B981', icon: '✅' },
    atrasado: { label: 'Atrasado', color: '#EF4444', icon: '⚠️' },
    perdido: { label: 'Perdido', color: '#991B1B', icon: '❌' }
};

// Default Images
const DEFAULT_IMAGES = {
    BOOK_COVER: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect width="200" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="20" fill="%239ca3af"%3E📚%3C/text%3E%3C/svg%3E',
    MEMBER_AVATAR: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%233B82F6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="40" fill="white"%3E👤%3C/text%3E%3C/svg%3E'
};

// Error Messages
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
    SERVER_ERROR: 'Erro no servidor. Por favor, tente novamente mais tarde.',
    VALIDATION_ERROR: 'Por favor, verifique os dados informados.',
    NOT_FOUND: 'Item não encontrado.',
    UNAUTHORIZED: 'Você não tem permissão para realizar esta ação.',
    DUPLICATE: 'Este item já existe.',
    GENERIC: 'Ocorreu um erro. Por favor, tente novamente.'
};

// Success Messages
const SUCCESS_MESSAGES = {
    BOOK_ADDED: '📚 Livro adicionado com sucesso!',
    BOOK_UPDATED: '✏️ Livro atualizado com sucesso!',
    BOOK_DELETED: '🗑️ Livro removido com sucesso!',
    MEMBER_ADDED: '👤 Membro adicionado com sucesso!',
    MEMBER_UPDATED: '✏️ Membro atualizado com sucesso!',
    MEMBER_DELETED: '🗑️ Membro desativado com sucesso!',
    LOAN_CREATED: '📤 Empréstimo realizado com sucesso!',
    LOAN_RETURNED: '✅ Devolução realizada com sucesso!',
    REVIEW_ADDED: '⭐ Avaliação adicionada com sucesso!',
    WISHLIST_ADDED: '⭐ Adicionado à lista de desejos!',
    POINTS_ADDED: '🎉 Pontos adicionados com sucesso!'
};

// Local Storage Keys
const STORAGE_KEYS = {
    THEME: 'biblioteca_theme',
    LAST_SYNC: 'biblioteca_last_sync',
    USER_PREFERENCES: 'biblioteca_preferences',
    CACHE_PREFIX: 'biblioteca_cache_'
};

// Theme Configuration
const THEMES = {
    light: {
        name: 'Claro',
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        background: '#FFFFFF',
        surface: '#F3F4F6',
        text: '#1F2937',
        textSecondary: '#6B7280'
    },
    dark: {
        name: 'Escuro',
        primary: '#60A5FA',
        secondary: '#A78BFA',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
        textSecondary: '#9CA3AF'
    }
};

// Animation Durations (milliseconds)
const ANIMATIONS = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    MODAL: 400,
    CARD_HOVER: 200
};

// Validation Rules
const VALIDATION = {
    ISBN: {
        pattern: /^(?:\d{10}|\d{13})$/,
        message: 'ISBN deve ter 10 ou 13 dígitos'
    },
    EMAIL: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email inválido'
    },
    PHONE: {
        pattern: /^(\+55\s?)?(\d{2}\s?)?(\d{4,5})[-\s]?(\d{4})$/,
        message: 'Telefone inválido'
    },
    YEAR: {
        min: 1000,
        max: new Date().getFullYear() + 1,
        message: `Ano deve estar entre 1000 e ${new Date().getFullYear() + 1}`
    },
    RATING: {
        min: 1,
        max: 5,
        message: 'Nota deve estar entre 1 e 5'
    }
};

// API Endpoints
const API_ENDPOINTS = {
    // Members
    MEMBERS: '/membros',
    MEMBER_BY_ID: (id) => `/membros/${id}`,
    MEMBER_POINTS: (id) => `/membros/${id}/pontos`,
    
    // Books
    BOOKS: '/livros',
    BOOK_BY_ID: (id) => `/livros/${id}`,
    
    // Loans
    LOANS: '/emprestimos',
    LOAN_BY_ID: (id) => `/emprestimos/${id}`,
    LOAN_RETURN: (id) => `/emprestimos/${id}/devolver`,
    LOANS_BY_MEMBER: (id) => `/emprestimos/membro/${id}`,
    
    // Reviews
    REVIEWS: '/avaliacoes',
    REVIEW_BY_ID: (id) => `/avaliacoes/${id}`,
    REVIEWS_BY_BOOK: (id) => `/avaliacoes/livro/${id}`,
    REVIEWS_BY_MEMBER: (id) => `/avaliacoes/membro/${id}`,
    TOP_RATED: '/avaliacoes/top',
    
    // Wishlist
    WISHLIST: '/wishlist',
    WISHLIST_BY_ID: (id) => `/wishlist/${id}`,
    WISHLIST_BUY: (id) => `/wishlist/${id}/comprar`,
    WISHLIST_SUGGESTIONS: '/wishlist/sugestoes',
    
    // Statistics
    STATS: '/estatisticas'
};

// Feature Flags (for easy feature toggling)
const FEATURES = {
    DARK_MODE: true,
    GAMIFICATION: true,
    REVIEWS: true,
    WISHLIST: true,
    EXTERNAL_LOANS: true,
    BOOK_COVERS: true,
    MEMBER_AVATARS: true,
    STATISTICS: true,
    EXPORT_DATA: false, // Future feature
    IMPORT_DATA: false, // Future feature
    NOTIFICATIONS: true,
    SEARCH: true,
    FILTERS: true
};

// Debug Mode
const DEBUG = {
    ENABLED: true,
    LOG_API_CALLS: true,
    LOG_ERRORS: true,
    SHOW_PERFORMANCE: true
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        APP_CONSTANTS,
        BOOK_GENRES,
        MEMBER_TYPES,
        PRIORITY_LEVELS,
        READER_LEVELS,
        AGE_RECOMMENDATIONS,
        CONSERVATION_STATES,
        LOAN_STATUS,
        DEFAULT_IMAGES,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES,
        STORAGE_KEYS,
        THEMES,
        ANIMATIONS,
        VALIDATION,
        API_ENDPOINTS,
        FEATURES,
        DEBUG
    };
}

// Log configuration loaded
console.log('✅ Configuration loaded successfully');
console.log(`📡 API Base URL: ${API_CONFIG.BASE_URL}`);
console.log(`🎮 Features enabled:`, Object.entries(FEATURES).filter(([_, v]) => v).map(([k, _]) => k).join(', '));