// =====================================
// js/api.js - API Communication Layer
// =====================================

/**
 * A service module for interacting with the Biblioteca Familiar API.
 * Encapsulates all fetch requests, error handling, and query building.
 */
const api = (() => {

    /**
     * Builds the request headers, merging defaults with any overrides.
     * @private
     * @param {object} [extraHeaders={}] - Additional headers to include.
     * @returns {object} Headers object.
     */
    const _buildHeaders = (extraHeaders = {}) => ({
        'Content-Type': 'application/json',
        ...extraHeaders
    });

    /**
     * Core request handler for all API calls.
     * @private
     * @param {string} endpoint - The API endpoint (e.g., '/livros').
     * @param {string} [method='GET'] - HTTP method.
     * @param {object|null} [body=null] - Request body for POST/PUT.
     * @param {object} [headers={}] - Extra headers (e.g., auth).
     * @returns {Promise<any>} Resolves with parsed response or throws structured error.
     */
    const _request = async (endpoint, method = 'GET', body = null, headers = {}) => {
        const url = API_CONFIG.BASE_URL + endpoint;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const options = {
            method,
            headers: _buildHeaders(headers),
            signal: controller.signal
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            clearTimeout(timeoutId);

            // Handle no-content responses
            if (response.status === 204) return null;

            let data;
            try {
                data = await response.json();
            } catch {
                data = null; // Non-JSON response
            }

            if (!response.ok) {
                const message = data?.erro || data?.aviso || ERROR_MESSAGES.SERVER_ERROR;
                throw {
                    status: response.status,
                    message,
                    details: data
                };
            }

            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            if (DEBUG.LOG_ERRORS) {
                console.error(`❌ API Error on ${method} ${url}:`, error);
            }

            // Normalize error object
            if (error.name === 'AbortError') {
                throw { status: 408, message: ERROR_MESSAGES.TIMEOUT, details: null };
            }

            if (error.status) {
                throw error; // Already structured
            }

            throw {
                status: 0,
                message: error.message || ERROR_MESSAGES.NETWORK_ERROR,
                details: error
            };
        }
    };

    /**
     * Converts a parameters object into a URL query string.
     * @private
     * @param {object} params - The parameters to convert.
     * @returns {string} Query string (e.g., '?genero=Ficção&disponivel=true').
     */
    const _buildQueryString = (params) => {
        const query = new URLSearchParams(params).toString();
        return query ? `?${query}` : '';
    };

    // =====================================
    // Public API Methods
    // =====================================

    return {
        // --- Statistics ---
        getStatistics: () => _request(API_ENDPOINTS.STATS),

        // --- Books ---
        getBooks: (filters = {}) => _request(API_ENDPOINTS.BOOKS + _buildQueryString(filters)),
        getBookById: (id) => _request(API_ENDPOINTS.BOOK_BY_ID(id)),
        createBook: (bookData) => _request(API_ENDPOINTS.BOOKS, 'POST', bookData),
        updateBook: (id, bookData) => _request(API_ENDPOINTS.BOOK_BY_ID(id), 'PUT', bookData),
        deleteBook: (id) => _request(API_ENDPOINTS.BOOK_BY_ID(id), 'DELETE'),

        // --- Members ---
        getMembers: () => _request(API_ENDPOINTS.MEMBERS),
        createMember: (memberData) => _request(API_ENDPOINTS.MEMBERS, 'POST', memberData),

        // --- Loans ---
        getLoans: (filters = {}) => _request(API_ENDPOINTS.LOANS + _buildQueryString(filters)),
        createLoan: (loanData) => _request(API_ENDPOINTS.LOANS, 'POST', loanData),
        returnLoan: (id) => _request(API_ENDPOINTS.LOAN_RETURN(id), 'PUT'),

        // --- Reviews ---
        getReviewsByBook: (bookId) => _request(API_ENDPOINTS.REVIEWS_BY_BOOK(bookId)),
        createReview: (reviewData) => _request(API_ENDPOINTS.REVIEWS, 'POST', reviewData),
        deleteReview: (id) => _request(API_ENDPOINTS.REVIEW_BY_ID(id), 'DELETE'),

        // --- Wishlist ---
        getWishlist: () => _request(API_ENDPOINTS.WISHLIST),
        getWishlistSuggestions: () => _request(API_ENDPOINTS.WISHLIST_SUGGESTIONS),
        addToWishlist: (wishData) => _request(API_ENDPOINTS.WISHLIST, 'POST', wishData),
        deleteFromWishlist: (id) => _request(API_ENDPOINTS.WISHLIST_BY_ID(id), 'DELETE'),
        markWishlistAsPurchased: (id) => _request(API_ENDPOINTS.WISHLIST_BUY(id), 'POST')
    };
})();

// Debug log
if (DEBUG.LOG_API_CALLS) {
    console.log('✅ API Service initialized.');
}
