// =====================================
// js/emprestimos.js - Loan Management
// =====================================

const emprestimos = (() => {
    // --- State ---
    let allLoans = [];
    let currentFilter = 'ativos'; // 'ativos', 'historico', 'atrasados'
    let availableBooks = [];
    let activeMembers = [];

    // --- DOM Elements ---
    const loansList = document.getElementById('loansList');
    const loanForm = document.getElementById('loanForm');
    const loanTabs = document.querySelector('#emprestimos .tabs');
    const loanBookSelect = document.getElementById('loanBook');
    const loanMemberSelect = document.getElementById('loanMember');
    const loanTypeSelect = document.getElementById('loanType');
    const internalLoanFields = document.getElementById('internalLoan');
    const externalLoanFields = document.getElementById('externalLoan');

    /**
     * Initializes the module.
     */
    const init = async () => {
        console.log('🔄 Initializing loans module...');
        setupEventListeners();
        await loadLoans();
        // Pre-load data for the modal in the background
        loadModalPrerequisites();
    };

    /**
     * Sets up all event listeners for the loans section.
     */
    const setupEventListeners = () => {
        loanTabs?.addEventListener('click', handleTabClick);
        loanForm?.addEventListener('submit', handleCreateLoan);
        loanTypeSelect?.addEventListener('change', toggleLoanTypeFields);
        loansList?.addEventListener('click', handleLoanAction);
    };

    /**
     * Fetches and displays loans from the API based on the current filter.
     */
    const loadLoans = async () => {
        try {
            window.showLoading?.();
            const loans = await window.api.getLoans({ status: currentFilter });
            allLoans = loans;
            displayLoans(allLoans);
        } catch (error) {
            console.error('Error loading loans:', error);
            window.showToast?.(error.message || 'Erro ao carregar os empréstimos.', 'error');
            if (loansList) {
                loansList.innerHTML = `<p class="error-message">Não foi possível carregar os empréstimos.</p>`;
            }
        } finally {
            window.hideLoading?.();
        }
    };

    /**
     * Fetches necessary data (books, members) for the loan creation modal.
     */
    const loadModalPrerequisites = async () => {
        try {
            const [books, members] = await Promise.all([
                window.api.getBooks({ disponivel: true }),
                window.api.getMembers()
            ]);
            
            availableBooks = books;
            activeMembers = members.filter(m => m.ativo);

            populateSelect(loanBookSelect, availableBooks, 'id_livro', b => `${b.titulo} - ${b.autor}`);
            populateSelect(loanMemberSelect, activeMembers, 'id_membro', m => m.nome);

        } catch (error) {
            console.error('Error loading prerequisites for loan modal:', error);
            window.showToast?.('Erro ao carregar dados para empréstimo.', 'error');
        }
    };

    /**
     * Populates a select dropdown with options.
     */
    const populateSelect = (selectElement, items, valueKey, textFn) => {
        if (!selectElement) return;
        selectElement.innerHTML = '<option value="">Selecione...</option>';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueKey];
            option.textContent = textFn(item);
            selectElement.appendChild(option);
        });
    };

    /**
     * Renders the list of loans.
     */
    const displayLoans = (loans) => {
        if (!loansList) return;
        loansList.innerHTML = '';

        if (!loans || loans.length === 0) {
            loansList.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📤</span>
                    <p>Nenhum empréstimo encontrado para este filtro.</p>
                </div>
            `;
            return;
        }

        loans.forEach(loan => {
            const loanItem = createLoanItem(loan);
            loansList.appendChild(loanItem);
        });
    };

    /**
     * Creates a DOM element for a single loan item.
     */
    const createLoanItem = (loan) => {
        const item = document.createElement('div');
        const isOverdue = loan.status === 'atrasado';
        item.className = `loan-item ${isOverdue ? 'overdue' : ''}`;
        item.dataset.loanId = loan.id_emprestimo;
        item.setAttribute('role', 'listitem');

        const statusConfig = window.LOAN_STATUS?.[loan.status] || { icon: '❓', label: 'Desconhecido' };
        const loanTo = loan.nome_membro || loan.nome_amigo_externo || 'Desconhecido';
        
        item.innerHTML = `
            <div class="loan-details">
                <span class="loan-book-title">${loan.titulo_livro}</span>
                <span class="loan-borrower">para <strong>${loanTo}</strong></span>
            </div>
            <div class="loan-dates">
                <span>Emprestado em: ${window.utils?.formatDate(loan.data_emprestimo)}</span>
                <span>Devolver até: ${window.utils?.formatDate(loan.data_devolucao_prevista)}</span>
            </div>
            <div class="loan-status">
                <span class="badge badge-${loan.status}">${statusConfig.icon} ${statusConfig.label}</span>
            </div>
            <div class="loan-actions">
                ${loan.status === 'emprestado' || loan.status === 'atrasado' ? 
                    `<button class="action-btn btn-primary js-return-loan" aria-label="Registrar devolução de ${loan.titulo_livro}">Devolver</button>` :
                    `<span class="returned-date">Devolvido em: ${window.utils?.formatDate(loan.data_devolvido)}</span>`
                }
            </div>
        `;
        return item;
    };

    /**
     * Handles clicks on the filter tabs.
     */
    const handleTabClick = (e) => {
        const target = e.target.closest('.tab-btn');
        if (!target) return;

        currentFilter = target.dataset.tab;
        
        document.querySelectorAll('#emprestimos .tab-btn').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');

        loadLoans();
    };

    /**
     * Handles the submission of the "Create Loan" form.
     */
    const handleCreateLoan = async (e) => {
        e.preventDefault();
        const formData = new FormData(loanForm);
        const loanData = window.formDataToObject?.(formData);

        if (!loanData.id_livro) {
            window.showToast?.('Por favor, selecione um livro.', 'warning');
            return;
        }
        if (loanData.tipo_emprestimo === 'interno' && !loanData.id_membro) {
             window.showToast?.('Por favor, selecione um membro.', 'warning');
            return;
        }
        if (loanData.tipo_emprestimo === 'externo' && !loanData.nome_amigo) {
             window.showToast?.('Por favor, informe o nome do amigo.', 'warning');
            return;
        }

        try {
            window.showLoading?.();
            await window.api.createLoan(loanData);
            window.showToast?.('Empréstimo registrado com sucesso!', 'success');
            window.closeModal?.('loanModal');
            loanForm.reset();
            await loadLoans(); 
            await loadModalPrerequisites(); 
        } catch (error) {
            window.showToast?.(error.message || 'Erro ao registrar empréstimo.', 'error');
        } finally {
            window.hideLoading?.();
        }
    };
    
    /**
     * Handles actions on loan items via event delegation.
     */
    const handleLoanAction = (e) => {
        const target = e.target;
        if (target.classList.contains('js-return-loan')) {
            const loanItem = target.closest('.loan-item');
            const loanId = loanItem?.dataset.loanId;
            if (loanId) {
                // Enhancement: Replace confirm() with a custom modal if available
                if (window.showConfirmModal) {
                    window.showConfirmModal('Confirmar a devolução deste livro?', () => {
                        handleReturnLoan(loanId);
                    });
                } else if (confirm('Confirmar a devolução deste livro?')) {
                    handleReturnLoan(loanId);
                }
            }
        }
    };

    /**
     * Handles returning a book.
     */
    const handleReturnLoan = async (loanId) => {
        try {
            window.showLoading?.();
            await window.api.returnLoan(loanId);
            window.showToast?.('Livro devolvido com sucesso!', 'success');
            await loadLoans(); 
            await loadModalPrerequisites();
        } catch (error) {
            window.showToast?.(error.message || 'Erro ao devolver o livro.', 'error');
        } finally {
            window.hideLoading?.();
        }
    };

    /**
     * Toggles fields based on loan type.
     */
    const toggleLoanTypeFields = () => {
        const selectedType = loanTypeSelect.value;
        if (selectedType === 'interno') {
            internalLoanFields.style.display = 'block';
            externalLoanFields.style.display = 'none';
            loanMemberSelect.required = true;
            document.getElementById('friendName').required = false;
        } else {
            internalLoanFields.style.display = 'none';
            externalLoanFields.style.display = 'block';
            loanMemberSelect.required = false;
            document.getElementById('friendName').required = true;
        }
    };
    
    /**
     * Enhancement: Stub for showing loan history.
     */
    const showLoanHistory = (id, type = 'book') => {
        window.showToast?.(`Histórico de empréstimos para ${type} #${id} ainda não implementado.`, 'info');
    };

    // --- Public API ---
    return {
        init,
        refresh: loadLoans
    };
})();
