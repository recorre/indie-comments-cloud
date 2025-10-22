(function() {
    'use strict';
    const CONTAINER_ID = 'indie-comments-container';
    const API_BASE_URL = 'https://openapi.nocodebackend.com';
    const INSTANCE_NAME = '41300_indie_comments_v2';

    const widgetCSS = `
        .indie-comments-widget {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            margin-top: 2rem;
        }
        .indie-comments-widget * {
            box-sizing: border-box;
        }
        .indie-comments-widget h3 {
            font-size: 1.25em;
            margin-top: 0;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .indie-comments-widget .supporter-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.5em;
            font-weight: bold;
            margin-left: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            animation: subtle-pulse 3s ease-in-out infinite;
        }
        @keyframes subtle-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .indie-comments-widget .comment-list {
            list-style: none;
            padding: 0;
            margin: 0 0 1.5rem 0;
        }
        .indie-comments-widget .comment {
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        .indie-comments-widget .comment-author {
            font-weight: bold;
            color: #0052cc;
            margin-bottom: 0.5rem;
        }
        .indie-comments-widget .comment-timestamp {
            font-size: 0.8em;
            color: #666;
            margin-left: 0.5rem;
        }
        .indie-comments-widget .comment-message {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .indie-comments-widget .comment-form {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .indie-comments-widget .comment-form input,
        .indie-comments-widget .comment-form textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1em;
            font-family: inherit;
        }
        .indie-comments-widget .comment-form textarea {
            min-height: 100px;
            resize: vertical;
        }
        .indie-comments-widget .comment-form button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            align-self: flex-end;
            transition: background-color 0.2s;
        }
        .indie-comments-widget .comment-form button:hover {
            background-color: #0056b3;
        }
        .indie-comments-widget .comment-form button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .indie-comments-widget .alert {
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        .indie-comments-widget .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .indie-comments-widget .alert-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .indie-comments-widget .loading {
            text-align: center;
            color: #666;
        }
    `;

    function injectCSS() {
        if (document.getElementById('indie-comments-css')) return;
        const style = document.createElement('style');
        style.id = 'indie-comments-css';
        style.textContent = widgetCSS;
        document.head.appendChild(style);
    }

    // Cache para sites (reduz chamadas API)
    const SITE_CACHE = {};
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    async function getSiteByApiKey(apiKey) {
        // Verificar cache
        if (SITE_CACHE[apiKey] &&
            Date.now() - SITE_CACHE[apiKey].timestamp < CACHE_DURATION) {
            return SITE_CACHE[apiKey].data;
        }

        // Buscar da API com paginação
        const allSitesRes = await apiCall('/read/sites?limit=100&includeTotal=true');
        const site = allSitesRes.data.find(s => s.api_key === apiKey);

        if (site) {
            SITE_CACHE[apiKey] = { data: site, timestamp: Date.now() };
        }

        return site;
    }

    async function apiCall(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Instance': INSTANCE_NAME,
            }
        };
        const config = { ...defaultOptions, ...options };
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText} (${response.status})`);
            }
            return await response.json();
        } catch (error) {
            console.error('Indie Comments: Falha na chamada da API.', error);
            throw error;
        }
    }

    // Obter IP do cliente (para moderação)
    async function getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return '0.0.0.0'; // Fallback se falhar
        }
    }

    async function init() {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) {
            console.error(`Indie Comments: Container #${CONTAINER_ID} não encontrado.`);
            return;
        }
        const scriptTag = document.querySelector('script[src*="indie_comments.js"]');
        const apiKey = scriptTag?.dataset.apiKey;
        if (!apiKey) {
            container.innerHTML = '<div class="alert alert-error">Erro: Chave da API (data-api-key) não encontrada no script.</div>';
            return;
        }
        injectCSS();
        container.innerHTML = '<div class="loading">Carregando comentários...</div>';
        let currentThreadId;
        try {
            const site = await getSiteByApiKey(apiKey);
            if (!site) {
                throw new Error('Chave da API inválida.');
            }
            // Buscar plano do usuário dono do site
            const userRes = await apiCall(`/read/users?id=${site.user_id}`);
            const userPlan = userRes.data[0]?.plan || 'free';
            const pageIdentifier = window.location.pathname;
            const pageTitle = document.title;
            let thread;
            const searchThreadsRes = await apiCall(`/read/threads?site_id=${site.id}&page_identifier=${encodeURIComponent(pageIdentifier)}&includeTotal=true`);
            if (searchThreadsRes.data.length > 0) {
                thread = searchThreadsRes.data[0];
            } else {
                const createThreadRes = await apiCall('/create/threads', {
                    method: 'POST',
                    body: JSON.stringify({ site_id: site.id, page_identifier: pageIdentifier, page_title: pageTitle })
                });
                thread = { id: createThreadRes.id };
            }
            currentThreadId = thread.id;
            const commentsRes = await apiCall(`/read/comments?thread_id=${thread.id}&visible=1&sort=created_at&order=desc&limit=50&includeTotal=true`);
            const comments = commentsRes.data || [];
            renderWidget(container, comments, { ...site, userPlan });
        } catch (error) {
            console.error('Indie Comments Error:', error);
            let userMessage = 'Não foi possível carregar os comentários.';
            if (error.message.includes('api_key')) {
                userMessage += ' Verifique se a chave da API está correta.';
            } else if (error.message.includes('network')) {
                userMessage += ' Verifique sua conexão com a internet.';
            }
            container.innerHTML = `<div class="alert alert-error">${userMessage}</div>`;
        }
    }

    function renderWidget(container, comments, site) {
        const isSupporter = site.userPlan === 'paid';
        const commentsHtml = comments.length > 0 ? comments.map(comment => `<li class="comment"><div class="comment-author">${comment.author_name}<span class="comment-timestamp">${new Date(comment.created_at).toLocaleDateString('pt-BR')}</span></div><div class="comment-message">${comment.message}</div></li>`).join('') : '<p>Seja o primeiro a comentar!</p>';
        const supporterBadge = isSupporter ? '<span class="supporter-badge">🌟 Supporter</span>' : '';
        container.innerHTML = `<div class="indie-comments-widget"><h3>Comentários ${supporterBadge}</h3><ul class="comment-list">${commentsHtml}</ul><form id="comment-form" class="comment-form"><input type="text" name="name" placeholder="Seu nome" required><input type="email" name="email" placeholder="Seu email" required><textarea name="message" placeholder="Sua mensagem" required></textarea><button type="submit">Enviar Comentário</button></form></div>`;
        const form = document.getElementById('comment-form');
        form.addEventListener('submit', (e) => handleCommentSubmit(e, currentThreadId));
    }

    let lastSubmit = 0;
    async function handleCommentSubmit(event, threadId) {
        event.preventDefault();
        const now = Date.now();
        if (now - lastSubmit < 3000) {
            alert('Aguarde alguns segundos antes de enviar outro comentário.');
            return;
        }
        lastSubmit = now;
        const form = event.target;
        const submitButton = form.querySelector('button');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        const formData = new FormData(form);
        const clientIP = await getClientIP();
        const commentData = {
            thread_id: threadId,
            author_name: formData.get('name'),
            author_email: formData.get('email'),
            message: formData.get('message'),
            ip_address: clientIP
        };
        try {
            await apiCall('/create/comments', {
                method: 'POST',
                body: JSON.stringify(commentData)
            });
            const widgetContainer = document.querySelector('.indie-comments-widget');
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success';
            successAlert.textContent = '✅ Comentário enviado para aprovação! Obrigado.';
            widgetContainer.insertBefore(successAlert, widgetContainer.firstChild);
            form.reset();
            setTimeout(() => successAlert.remove(), 5000);
        } catch (error) {
            alert('Ocorreu um erro ao enviar seu comentário. Tente novamente.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();