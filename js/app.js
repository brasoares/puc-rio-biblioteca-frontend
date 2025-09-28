// =====================================
// js/app.js - Main Application Logic (v2 - Refined)
// =====================================

/**
 * Main application module to control the SPA behavior.
 * Incorporates enhancements for resilience, accessibility, and performance.
 */
const App = (() => {
    // Application state
    let currentSection = null;
    const loadedModules = new Set();

    // DOM element references
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    /**
     * Initializes the application.
     * @public
     */
    const init = () => {
        console.log('🚀 Application initializing...');
        setupEventListeners();

        const initialSection = window.location.hash.substring(1) || 'dashboard';
        navigateTo(initialSection, true);

        // --- Optional Enhancement: Preloading ---
        // Preload other modules in the background after a short delay
        // to improve navigation speed to other sections.
        // I've kept this commented out so you can enable it if you wish.
        /*
        setTimeout(() => {
            ['livros', 'membros', 'emprestimos', 'wishlist'].forEach(id => {
                if (!loadedModules.has(id)) loadModuleForSection(id, true);
            });
        }, 2000);
        */
    };

    /**
     * Sets up all global event listeners.
     * @private
     */
    const setupEventListeners = () => {
        // Navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                navigateTo(sectionId);

                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileNavToggle.classList.remove('active');
                }
            });
        });

        // Mobile navigation toggle
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Browser back/forward navigation
        window.addEventListener('popstate', () => {
            const sectionId = window.location.hash.substring(1) || 'dashboard';
            navigateTo(sectionId, true);
        });

        // Global listener for Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.show').forEach(modal => {
                    // This is safer: it won't crash if utils.js hasn't loaded
                    window.closeModal?.(modal.id);
                });
            }
        });
    };

    /**
     * Handles navigation between sections.
     * @private
     * @param {string} sectionId - The ID of the section to display.
     * @param {boolean} [fromHistory=false] - Flag to prevent new history entries.
     */
    const navigateTo = async (sectionId, fromHistory = false) => {
        if (currentSection === sectionId && !fromHistory) return;

        console.log(`Navigating to: ${sectionId}`);
        currentSection = sectionId;

        sections.forEach(section => section.classList.remove('active'));

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Accessibility Improvement: Focus the new section's heading
            targetSection.querySelector('h1, h2, .focus-target')?.focus({ preventScroll: true });
        } else {
            console.error(`Section "${sectionId}" not found. Defaulting to dashboard.`);
            document.getElementById('dashboard')?.classList.add('active');
            currentSection = 'dashboard';
        }

        updateNavLinks();

        if (!fromHistory) {
            window.history.pushState(null, '', `#${currentSection}`);
        }

        await loadModuleForSection(currentSection);
    };

    /**
     * Dynamically loads and initializes the JavaScript module for a section.
     * @private
     * @param {string} sectionId - The section's ID.
     * @param {boolean} [isPreload=false] - If true, won't trigger refresh logic.
     */
    const loadModuleForSection = async (sectionId, isPreload = false) => {
        const module = window[sectionId];

        // Refresh Logic: If module is loaded, call its refresh method
        if (loadedModules.has(sectionId)) {
            if (!isPreload && typeof module?.refresh === 'function') {
                console.log(`Refreshing data for "${sectionId}"...`);
                await module.refresh();
            }
            return;
        }

        // Initialization Logic: If module has an init function, run it once
        try {
            if (typeof module?.init === 'function') {
                await module.init();
                loadedModules.add(sectionId);
                console.log(`✅ Module for "${sectionId}" loaded successfully.`);
            }
        } catch (error) {
            console.error(`Error initializing module for "${sectionId}":`, error);
            // Resilient Toast: Fallback to avoid crashing the app
            const toast = window.showToast || ((msg, type) => console.error(`${type}: ${msg}`));
            toast(`Erro ao carregar a seção ${sectionId}.`, 'error');
        }
    };

    /**
     * Updates the 'active' class on navigation links.
     * @private
     */
    const updateNavLinks = () => {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${currentSection}`;
            link.classList.toggle('active', isActive);
        });
    };

    return {
        init
    };
})();

// Initialize the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', App.init);