// =====================================
// js/livros.js - Books Management (v2 - Enhanced)
// =====================================

const livros = (() => {
    // --- State ---
    let allBooks = [];
    let currentFilters = {
        termo: '',
        genero: '',
        disponivel: null
    };

    // --- DOM Elements ---
    const booksGrid = document.getElementById('booksGrid');
    const searchInput = document.getElementById('bookSearch');
    const genreFilter = document.getElementById('genreFilter');
    const availableFilter = document.getElementById('availableFilter');
    const addBookForm = document.getElementById('addBookForm');

    /**
     * Initializes the module: sets up event listeners and loads initial data.
     * Called once by app.js.
     */
    const init = async () => {
        console.log('📚 Initializing books module...');
        setupEventListeners();
        populateGenreFilter(); // New function to load genres
        await loadBooks();
    };

    /**
     * Fetches and displays books from the API based on current filters.
     * Also serves as the refresh function for app.js.
     */
    const loadBooks = async () => {
        try {
            // Enhancement: Use optional chaining for resilience
            window.showLoading?.();
            const books = await api.getBooks(currentFilters);
            allBooks = books;
            displayBooks(allBooks);
        } catch (error) {
            console.error('Error loading books:', error);
            window.showToast?.(error.message || 'Erro ao carregar os livros.', 'error');
            booksGrid.innerHTML = `<p class="error-message">Não foi possível carregar os livros.</p>`;
        } finally {
            window.hideLoading?.();
        }
    };

    /**
     * Sets up all event listeners for the books section.
     */
    const setupEventListeners = () => {
        // Debounced search input
        searchInput.addEventListener('input', window.debounce?.(() => {
            currentFilters.termo = searchInput.value;
            loadBooks();
        }, 300));

        // Genre filter
        genreFilter.addEventListener('change', () => {
            currentFilters.genero = genreFilter.value;
            loadBooks();
        });

        // Availability filter - NOTE: The original code was correct, this is a minor syntax alternative
        availableFilter.addEventListener('change', (e) => {
            currentFilters.disponivel = e.target.checked;
            loadBooks();
        });

        // Add book form submission
        addBookForm.addEventListener('submit', handleAddBook);
    };
    
    /**
     * Populates the genre filter dropdown from the constants file.
     */
    const populateGenreFilter = () => {
        if (!window.BOOK_GENRES || genreFilter.options.length > 1) return;

        window.BOOK_GENRES.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    };

    /**
     * Renders the list of books into the grid.
     * @param {Array} books - The array of book objects to display.
     */
    const displayBooks = (books) => {
        booksGrid.innerHTML = ''; // Clear existing content

        if (!books || books.length === 0) {
            booksGrid.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📖</span>
                    <p>Nenhum livro encontrado.</p>
                    <button class="btn-primary" id="emptyStateAddBook">Adicionar Primeiro Livro</button>
                </div>
            `;
            // Enhancement: Add event listener instead of onclick
            document.getElementById('emptyStateAddBook').addEventListener('click', showAddModal);
            return;
        }

        books.forEach(book => {
            const bookCard = createBookCard(book);
            booksGrid.appendChild(bookCard);
        });
    };

    /**
     * Creates a DOM element for a single book card.
     * @param {object} book - The book object.
     * @returns {HTMLElement} The card element.
     */
    const createBookCard = (book) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.bookId = book.id_livro;
        // Accessibility Enhancement
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Livro: ${book.titulo}`);

        const isAvailable = book.disponivel;
        const statusClass = isAvailable ? 'status-available' : 'status-loaned';
        const statusText = isAvailable ? 'Disponível' : 'Emprestado';

        // Use resilient calls to global helpers
        card.innerHTML = `
            <div class="book-cover">
                <img src="${window.getBookCover?.(book.url_capa)}" alt="Capa de ${book.titulo}" onerror="this.src='${window.DEFAULT_IMAGES?.BOOK_COVER}'">
                <div class="book-status ${statusClass}">${statusText}</div>
                ${book.classico_familia ? '<div class="family-classic-badge" title="Clássico da Família">⭐</div>' : ''}
            </div>
            <div class="book-info">
                <h3 class="book-title">${window.truncateText?.(book.titulo, 35)}</h3>
                <p class="book-author">${window.truncateText?.(book.autor, 40)}</p>
                <div class="book-rating">
                    ${window.createStarRating?.(book.media_avaliacoes || 0)}
                </div>
            </div>
            <div class="book-actions">
                <button class="action-btn btn-secondary js-details">Detalhes</button>
                <button class="action-btn js-delete">Excluir</button>
            </div>
        `;
        
        // Enhancement: Use addEventListener for more robust code
        card.querySelector('.js-details').addEventListener('click', () => showDetails(book.id_livro));
        card.querySelector('.js-delete').addEventListener('click', () => handleDelete(book.id_livro));

        return card;
    };

    /**
     * Handles the submission of the "Add Book" form.
     * @param {Event} e - The form submission event.
     */
    const handleAddBook = async (e) => {
        e.preventDefault();
        const formData = new FormData(addBookForm);
        const bookData = window.formDataToObject?.(formData);

        // Enhancement: Client-side validation
        if (!bookData.titulo || !bookData.autor) {
            window.showToast?.('Título e autor são obrigatórios.', 'warning');
            return;
        }

        bookData.ano_publicacao = parseInt(bookData.ano_publicacao, 10) || null;
        bookData.classico_familia = bookData.classico_familia === 'on';

        try {
            window.showLoading?.();
            await api.createBook(bookData);
            window.showToast?.(window.SUCCESS_MESSAGES?.BOOK_ADDED, 'success');
            window.closeModal?.('addBookModal');
            addBookForm.reset();
            await loadBooks(); // Refresh the list
        } catch (error) {
            window.showToast?.(error.message || window.ERROR_MESSAGES?.GENERIC, 'error');
        } finally {
            window.hideLoading?.();
        }
    };

    /**
     * Handles the deletion of a book.
     * @param {number} bookId - The ID of the book to delete.
     */
    const handleDelete = async (bookId) => {
        // NOTE: A custom modal is better than confirm() in a real app
        if (!confirm('Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            window.showLoading?.();
            await api.deleteBook(bookId);
            window.showToast?.('Livro excluído com sucesso.', 'success');
            await loadBooks(); // Refresh
        } catch (error) {
            window.showToast?.(error.message || 'Erro ao excluir o livro.', 'error');
        } finally {
            window.hideLoading?.();
        }
    };
    
    /**
     * Opens the add book modal.
     */
    const showAddModal = () => {
        addBookForm.reset();
        window.openModal?.('addBookModal');
    };

    /**
     * Shows a placeholder for the book details functionality.
     * @param {number} bookId 
     */
    const showDetails = (bookId) => {
        console.log(`Showing details for book ID: ${bookId}`);
        window.showToast?.(`A visualização de detalhes do livro #${bookId} ainda não foi implementada.`, 'info');
    };

    // --- Public API ---
    // Expose only the necessary functions to the global scope.
    return {
        init,
        refresh: loadBooks // app.js will call this
    };
})();