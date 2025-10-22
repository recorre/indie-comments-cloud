document.addEventListener('DOMContentLoaded', () => {
    const views = { login: document.getElementById('login-view'), signup: document.getElementById('signup-view'), dashboard: document.getElementById('dashboard-view') };
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    const siteList = document.getElementById('site-list');
    const addSiteBtn = document.getElementById('add-site-btn');
    const addSiteForm = document.getElementById('add-site-form');
    const upgradeModal = document.getElementById('upgrade-modal');
    const upgradeForm = document.getElementById('upgrade-form');
    let currentUser = null;

    function showView(viewName) {
        console.log('Switching to view:', viewName);
        console.log('Available views:', Object.keys(views));
        Object.values(views).forEach(view => view.style.display = 'none');
        if (views[viewName]) {
            views[viewName].style.display = 'block';
            console.log('Successfully switched to view:', viewName);
        } else {
            console.error('View not found:', viewName);
        }
    }

    // Make showView globally accessible for HTML onclick handlers
    window.showView = showView;

    function hideAddSiteForm() {
        addSiteForm.style.display = 'none';
    }

    function closeUpgradeModal() {
        upgradeModal.close();
    }

    async function renderDashboard() {
        if (!currentUser) return;
        document.getElementById('user-name').textContent = currentUser.name;
        const badgeContainer = document.getElementById('plan-badge-container');
        badgeContainer.innerHTML = currentUser.plan === 'paid' ? '<span class="badge badge-paid">🌟 Supporter</span>' : '<span class="badge badge-free">Grátis</span>';
        renderSiteList();
    }

    async function renderSiteList() {
        const sites = await api.getSites(currentUser.id);
        siteList.innerHTML = '';
        if (sites.length === 0) {
            siteList.innerHTML = '<p>Você ainda não cadastrou nenhum site.</p>';
            return;
        }
        sites.forEach(site => {
            const embedCode = `<div id="indie-comments-container"></div>\n<script async src="https://SEU_DOMINIO/widget.js" data-api-key="${site.api_key}"></script>`;
            const siteCard = document.createElement('article');
            siteCard.classList.add('site-card');
            siteCard.innerHTML = `<h4>${site.site_name}</h4><p>${site.site_url}</p><div class="code-snippet">${embedCode}<button class="copy-btn" data-code="${embedCode.replace(/"/g, '"')}">Copiar</button></div><button class="contrast" onclick="handleDeleteSite(${site.id})">Excluir Site</button>`;
            siteList.appendChild(siteCard);
        });
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                navigator.clipboard.writeText(e.target.dataset.code);
                const originalText = e.target.textContent;
                e.target.textContent = 'Copiado!';
                setTimeout(() => e.target.textContent = originalText, 2000);
            });
        });
    }

    async function handleLogin(e) {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';

        try {
            const email = e.target.email.value;
            const password = e.target.password.value;
            const result = await api.login(email, password);
            if (result.success) {
                currentUser = result.user;
                localStorage.setItem('indieCommentsUser', JSON.stringify(currentUser));
                showView('dashboard');
                renderDashboard();
            } else {
                alert(result.error);
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        // Validate password confirmation
        if (password !== confirmPassword) {
            alert('As senhas não coincidem. Por favor, tente novamente.');
            return;
        }

        const result = await api.signup(name, email, password);
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('indieCommentsUser', JSON.stringify(currentUser));
            showView('dashboard');
            renderDashboard();
        } else {
            alert(result.error);
        }
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('indieCommentsUser');
        showView('login');
    }

    async function handleAddSite(e) {
        e.preventDefault();
        const url = document.getElementById('new-site-url').value;
        const name = document.getElementById('new-site-name').value;
        const result = await api.createSite(currentUser.id, url, name);
        if (result.success) {
            hideAddSiteForm();
            renderSiteList();
            e.target.reset();
        } else {
            if (result.error.includes('Limite de sites')) {
                upgradeModal.showModal();
            } else {
                alert(result.error);
            }
        }
    }

    async function handleDeleteSite(siteId) {
        if (confirm('Tem certeza que deseja excluir este site? Todos os comentários associados serão perdidos.')) {
            const result = await api.deleteSite(currentUser.id, siteId);
            if (result.success) {
                renderSiteList();
            } else {
                alert(result.error);
            }
        }
    }

    async function handleUpgrade(e) {
        e.preventDefault();
        const proof = document.getElementById('payment-proof').value;
        if (!proof) {
            alert('Por favor, cole o código ou email da transação.');
            return;
        }
        const result = await api.upgradePlan(currentUser.id, proof);
        if (result.success) {
            currentUser.plan = 'paid';
            localStorage.setItem('indieCommentsUser', JSON.stringify(currentUser));
            closeUpgradeModal();
            renderDashboard();
            alert('✅ Upgrade ativado com sucesso! Obrigado por apoiar o projeto.');
        } else {
            alert(result.error);
        }
    }

    function togglePasswordVisibility(event) {
        const button = event.target;
        const targetSelector = button.dataset.target; // e.g., "login-form password"
        const [formId, fieldName] = targetSelector.split(' ');
        const form = document.getElementById(formId);
        const input = form[fieldName];

        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
            button.setAttribute('aria-label', 'Ocultar senha');
        } else {
            input.type = 'password';
            button.textContent = '👁️';
            button.setAttribute('aria-label', 'Mostrar senha');
        }

        // Prevent the button click from triggering form submission or other events
        event.preventDefault();
        event.stopPropagation();
    }

    function checkAuth() {
        const savedUser = localStorage.getItem('indieCommentsUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            showView('dashboard');
            renderDashboard();
        } else {
            showView('login');
        }
    }

    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    logoutBtn.addEventListener('click', handleLogout);
    addSiteBtn.addEventListener('click', () => addSiteForm.style.display = 'block');
    addSiteForm.addEventListener('submit', handleAddSite);
    upgradeForm.addEventListener('submit', handleUpgrade);

    // Add password visibility toggle listeners
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', togglePasswordVisibility);
    });

    checkAuth();
});