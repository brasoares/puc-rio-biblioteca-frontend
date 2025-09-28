// =====================================
// js/membros.js - Member Management
// =====================================

const membros = (() => {
    // --- State ---
    let allMembers = [];

    // --- DOM Elements ---
    const membersGrid = document.getElementById('membersGrid');
    const addMemberForm = document.getElementById('addMemberForm');
    const addMemberButton = document.querySelector('#membros .btn-primary');

    /**
     * Initializes the module: sets up event listeners and loads initial data.
     */
    const init = async () => {
        console.log('👥 Initializing members module...');
        setupEventListeners();
        await loadMembers();
    };

    /**
     * Fetches and displays members from the API.
     */
    const loadMembers = async () => {
        try {
            window.showLoading?.();
            // Assuming api.js will have a getMembers function
            const members = await window.api.getMembers();
            allMembers = members;
            displayMembers(allMembers);
        } catch (error) {
            console.error('Error loading members:', error);
            window.showToast?.(error.message || 'Erro ao carregar os membros.', 'error');
            if (membersGrid) {
                membersGrid.innerHTML = `<p class="error-message">Não foi possível carregar os membros.</p>`;
            }
        } finally {
            window.hideLoading?.();
        }
    };

    /**
     * Sets up all event listeners for the members section.
     */
    const setupEventListeners = () => {
        addMemberForm?.addEventListener('submit', handleAddMember);
        addMemberButton?.addEventListener('click', showAddModal);
    };

    /**
     * Renders the list of members into the grid.
     */
    const displayMembers = (members) => {
        if (!membersGrid) return;
        membersGrid.innerHTML = '';

        if (!members || members.length === 0) {
            membersGrid.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">👥</span>
                    <p>Nenhum membro encontrado.</p>
                    <button id="addFirstMemberBtn" class="btn-primary">Adicionar Primeiro Membro</button>
                </div>
            `;
            // Add event listener for the new button
            document.getElementById('addFirstMemberBtn')?.addEventListener('click', showAddModal);
            return;
        }

        members.forEach(member => {
            const memberCard = createMemberCard(member);
            membersGrid.appendChild(memberCard);
        });
    };

    /**
     * Creates a DOM element for a single member card.
     */
    const createMemberCard = (member) => {
        const card = document.createElement('div');
        card.className = 'member-card'; // We will need to style this in cards.css
        card.dataset.memberId = member.id_membro;
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', `Membro: ${member.nome}`);

        const level = window.getReaderLevel?.(member.pontos) || { name: 'Iniciante', icon: '🔰', color: '#6b7280' };

        card.innerHTML = `
            <div class="member-avatar" style="background-color: ${member.avatar_cor || '#3B82F6'};">
                <span class="member-initials">${member.nome.charAt(0)}</span>
            </div>
            <div class="member-info">
                <h3 class="member-name">${member.nome} ${member.apelido ? `(${member.apelido})` : ''}</h3>
                <p class="member-level" style="color: ${level.color};">
                    ${level.icon} ${level.name} - ${member.pontos} pontos
                </p>
                <div class="member-stats">
                    <span>📚 Livros Lidos: ${member.livros_lidos || 0}</span>
                </div>
            </div>
            <div class="member-actions">
                <button class="action-btn">Ver Perfil</button>
            </div>
        `;
        return card;
    };

    /**
     * Handles the submission of the "Add Member" form.
     */
    const handleAddMember = async (e) => {
        e.preventDefault();
        const formData = new FormData(addMemberForm);
        const memberData = window.formDataToObject?.(formData);

        // Client-side validation
        if (!memberData.nome || !memberData.email) {
            window.showToast?.('Nome e email são obrigatórios.', 'warning');
            return;
        }
        if (window.isValidEmail && !window.isValidEmail(memberData.email)) {
             window.showToast?.('Por favor, insira um email válido.', 'warning');
            return;
        }

        try {
            window.showLoading?.();
            // Assuming api.js will have a createMember function
            await window.api.createMember(memberData);
            window.showToast?.('Membro adicionado com sucesso!', 'success');
            window.closeModal?.('addMemberModal');
            addMemberForm.reset();
            await loadMembers();
        } catch (error) {
            window.showToast?.(error.message || 'Erro ao adicionar membro.', 'error');
        } finally {
            window.hideLoading?.();
        }
    };
    
    /**
     * Opens the add member modal.
     */
    const showAddModal = () => {
        addMemberForm?.reset();
        window.openModal?.('addMemberModal');
    };

    // --- Public API ---
    return {
        init,
        refresh: loadMembers
    };
})();
