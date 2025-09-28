// =====================================
// js/utils.js - Utility Functions
// =====================================

// Format date to Brazilian format
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Format date with time
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

// Format currency to Brazilian Real
function formatCurrency(value) {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, APP_CONSTANTS.TOAST_DURATION);
}

// Show loading spinner
function showLoading() {
    document.getElementById('loadingSpinner').classList.add('show');
}

// Hide loading spinner
function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('show');
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// Debounce function for search/filter
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Validate email
function isValidEmail(email) {
    return VALIDATION.EMAIL.pattern.test(email);
}

// Validate ISBN
function isValidISBN(isbn) {
    if (!isbn) return true; // ISBN is optional
    return VALIDATION.ISBN.pattern.test(isbn.replace(/[-\s]/g, ''));
}

// Get reader level info
function getReaderLevel(points) {
    for (const level of READER_LEVELS) {
        if (points >= level.minPoints && points <= level.maxPoints) {
            return level;
        }
    }
    return READER_LEVELS[0];
}

// Generate avatar with initials
function generateAvatar(name, color = '#3B82F6') {
    const initials = name
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    
    return `
        <div class="avatar" style="background-color: ${color}">
            <span class="avatar-initials">${initials}</span>
        </div>
    `;
}

// Calculate days difference
function daysDifference(date1, date2 = new Date()) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Check if loan is overdue
function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

// Get status badge HTML
function getStatusBadge(status, type = 'loan') {
    const config = type === 'loan' ? LOAN_STATUS[status] : null;
    if (!config) return '';
    
    return `<span class="badge badge-${status}">${config.icon} ${config.label}</span>`;
}

// Get priority badge HTML
function getPriorityBadge(priority) {
    const config = PRIORITY_LEVELS[priority];
    if (!config) return '';
    
    return `<span class="badge priority-${priority}">${config.icon} ${config.label}</span>`;
}

// Sort array by property
function sortBy(array, property, order = 'asc') {
    return array.sort((a, b) => {
        const aVal = a[property];
        const bVal = b[property];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
}

// Filter array by search term
function filterBySearch(array, searchTerm, properties) {
    if (!searchTerm) return array;
    
    const term = searchTerm.toLowerCase();
    return array.filter(item => {
        return properties.some(prop => {
            const value = item[prop];
            if (!value) return false;
            return value.toString().toLowerCase().includes(term);
        });
    });
}

// Create star rating HTML
function createStarRating(rating, maxRating = 5) {
    let html = '<div class="star-rating">';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= maxRating; i++) {
        if (i <= fullStars) {
            html += '<span class="star filled">⭐</span>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            html += '<span class="star half">⭐</span>';
        } else {
            html += '<span class="star empty">☆</span>';
        }
    }
    
    html += `<span class="rating-number">${rating.toFixed(1)}</span>`;
    html += '</div>';
    return html;
}

// Truncate text with ellipsis
function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Get book cover image
function getBookCover(coverUrl) {
    return coverUrl || DEFAULT_IMAGES.BOOK_COVER;
}

// Get member avatar
function getMemberAvatar(avatarColor, name) {
    if (!avatarColor) return DEFAULT_IMAGES.MEMBER_AVATAR;
    return generateAvatar(name, avatarColor);
}

// Save to local storage with expiry
function saveToCache(key, data, expiryMinutes = 5) {
    const item = {
        data: data,
        expiry: new Date().getTime() + (expiryMinutes * 60 * 1000)
    };
    localStorage.setItem(STORAGE_KEYS.CACHE_PREFIX + key, JSON.stringify(item));
}

// Get from local storage cache
function getFromCache(key) {
    const itemStr = localStorage.getItem(STORAGE_KEYS.CACHE_PREFIX + key);
    if (!itemStr) return null;
    
    try {
        const item = JSON.parse(itemStr);
        const now = new Date().getTime();
        
        if (now > item.expiry) {
            localStorage.removeItem(STORAGE_KEYS.CACHE_PREFIX + key);
            return null;
        }
        
        return item.data;
    } catch (e) {
        return null;
    }
}

// Clear all cache
function clearCache() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith(STORAGE_KEYS.CACHE_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
}

// Parse form data to object
function formDataToObject(formData) {
    const object = {};
    formData.forEach((value, key) => {
        // Handle checkboxes
        if (object[key]) {
            if (!Array.isArray(object[key])) {
                object[key] = [object[key]];
            }
            object[key].push(value);
        } else {
            object[key] = value;
        }
    });
    return object;
}

// Highlight search term in text
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Export functions
window.utils = {
    formatDate,
    formatDateTime,
    formatCurrency,
    showToast,
    showLoading,
    hideLoading,
    openModal,
    closeModal,
    debounce,
    isValidEmail,
    isValidISBN,
    getReaderLevel,
    generateAvatar,
    daysDifference,
    isOverdue,
    getStatusBadge,
    getPriorityBadge,
    sortBy,
    filterBySearch,
    createStarRating,
    truncateText,
    getBookCover,
    getMemberAvatar,
    saveToCache,
    getFromCache,
    clearCache,
    formDataToObject,
    highlightText
};

// Also expose commonly used functions globally
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.openModal = openModal;
window.closeModal = closeModal;

console.log('✅ Utils loaded successfully');