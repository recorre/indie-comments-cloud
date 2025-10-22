// --- API REAL PARA NOCODEBACKEND ---
// Using backend proxy to securely handle API keys
const API_BASE_URL = 'https://indie-comments-cloud-production.up.railway.app/api/proxy';  // Production Railway URL
const INSTANCE_NAME = '41300_indie_comments_v2';  // Still needed for the backend proxy to forward

// Classe de erro customizada para melhor tratamento
class APIError extends Error {
    constructor(message, code, details = null) {
        super(message);
        this.name = 'APIError';
        this.code = code;
        this.details = details;
    }
}

// Função auxiliar para chamadas de API com tratamento robusto de erros
async function apiCall(endpoint, options = {}) {
    // Add the instance as a query parameter for the backend to use
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${API_BASE_URL}${endpoint}${separator}Instance=${INSTANCE_NAME}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const config = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorText = await response.text();

            // Mapear códigos HTTP para erros específicos
            if (response.status === 429) {
                throw new APIError(
                    'Muitas requisições. Aguarde 1 minuto.',
                    'RATE_LIMIT',
                    { status: response.status }
                );
            }

            if (response.status === 401 || response.status === 403) {
                throw new APIError(
                    'Credenciais inválidas.',
                    'AUTH_ERROR',
                    { status: response.status }
                );
            }

            throw new APIError(
                `Erro na API: ${errorText}`,
                'API_ERROR',
                { status: response.status, body: errorText }
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof APIError) {
            throw error;  // Re-throw erros customizados
        }

        // Erro de rede ou parsing
        throw new APIError(
            'Erro de conexão. Verifique sua internet.',
            'NETWORK_ERROR',
            { originalError: error.message }
        );
    }
}

// Validação de email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- FUNÇÕES DE AUTENTICAÇÃO COM SEGURANÇA ---

// Login: Usa rota específica de login com verificação bcrypt no backend
async function login(email, password) {
    if (!isValidEmail(email)) {
        return { success: false, error: 'Email inválido.' };
    }

    try {
        // Usar rota específica de login
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            return { success: false, error: 'Email ou senha incorretos.' };
        }

        const usersRes = await response.json();
        const user = usersRes.data[0];

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                plan: user.plan
            }
        };
    } catch (error) {
        if (error.code === 'RATE_LIMIT') {
            return { success: false, error: error.message };
        }

        if (error.code === 'NETWORK_ERROR') {
            return { success: false, error: 'Sem conexão com a internet.' };
        }

        return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
}

// Signup: Cria usuário com senha hasheada no backend
async function signup(name, email, password) {
    if (!isValidEmail(email)) {
        return { success: false, error: 'Email inválido.' };
    }
    if (password.length < 6) {
        return { success: false, error: 'A senha deve ter pelo menos 6 caracteres.' };
    }
    try {
        // Verificar se email já existe
        const existingRes = await apiCall(`/read/users?email=${encodeURIComponent(email)}`, {
            method: 'GET'
        });
        if (existingRes.data.length > 0) {
            return { success: false, error: 'Este email já está em uso.' };
        }

        // Criar usuário - backend fará o hash da senha
        console.log('Creating user with data:', { name, email, password_hash: '[HASHED]' });
        const createRes = await apiCall('/create/users', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password_hash: password  // Backend fará hash
            })
        });
        console.log('User creation response:', createRes);
        return {
            success: true,
            user: {
                id: createRes.id,
                name,
                email,
                plan: 'free'
            }
        };
    } catch (error) {
        return { success: false, error: 'Erro ao criar conta. Tente novamente.' };
    }
}

// --- FUNÇÕES DE GESTÃO DE SITES ---

async function getUser(userId) {
    try {
        const res = await apiCall(`/read/users?id=${userId}`);
        if (res.data.length === 0) throw new Error('Usuário não encontrado');
        return res.data[0];
    } catch (error) {
        throw new Error('Erro ao buscar usuário.');
    }
}

async function getSites(userId) {
    try {
        const res = await apiCall(`/read/sites?user_id=${userId}&includeTotal=true`);
        return res.data || [];
    } catch (error) {
        console.error('Erro ao buscar sites:', error);
        return [];
    }
}

async function createSite(userId, siteUrl, siteName) {
    try {
        // Validar formato da URL
        try {
            new URL(siteUrl); // Lança erro se inválida
        } catch {
            return {
                success: false,
                error: 'URL inválida. Use formato: https://meusite.com'
            };
        }

        const user = await getUser(userId);
        const userSites = await getSites(userId);
        const limit = user.plan === 'free' ? 1 : 3;
        if (userSites.length >= limit) {
            return { success: false, error: `Limite de sites atingido para o plano ${user.plan}.` };
        }
        const apiKey = `ic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const createRes = await apiCall('/create/sites', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                site_url: siteUrl,
                site_name: siteName,
                api_key: apiKey
            })
        });
        return {
            success: true,
            site: {
                id: createRes.id,
                user_id: userId,
                name: siteName,
                url: siteUrl,
                api_key: apiKey
            }
        };
    } catch (error) {
        return { success: false, error: 'Erro ao criar site.' };
    }
}

async function deleteSite(userId, siteId) {
    try {
        await apiCall(`/delete/sites/${siteId}`, {
            method: 'DELETE'
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Erro ao excluir site.' };
    }
}

// --- FUNÇÃO DE UPGRADE ---

async function upgradePlan(userId, paymentProof) {
    try {
        await apiCall(`/update/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({
                plan: 'paid',
                payment_proof: paymentProof
            })
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Erro ao ativar upgrade.' };
    }
}

// --- FUNÇÕES DE MODERAÇÃO ---

async function getPendingComments(userId) {
    try {
        // Buscar sites do usuário
        const sites = await getSites(userId);
        const siteIds = sites.map(s => s.id);
        if (siteIds.length === 0) return [];

        // Buscar threads desses sites
        const threadsRes = await apiCall(`/read/threads?site_id[in]=${siteIds.join(',')}&includeTotal=true`);
        const userThreads = threadsRes.data || [];
        const threadIds = userThreads.map(t => t.id);
        if (threadIds.length === 0) return [];

        // Buscar comentários pendentes com paginação
        const commentsRes = await apiCall(`/read/comments?visible=0&thread_id[in]=${threadIds.join(',')}&sort=created_at&order=desc&limit=50&includeTotal=true`);
        const pendingComments = commentsRes.data || [];
        return pendingComments;
    } catch (error) {
        console.error('Erro ao buscar comentários pendentes:', error);
        return [];
    }
}

async function approveComment(commentId) {
    try {
        await apiCall(`/update/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify({ visible: true })
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Erro ao aprovar comentário.' };
    }
}

async function rejectComment(commentId) {
    try {
        await apiCall(`/delete/comments/${commentId}`, {
            method: 'DELETE'
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Erro ao rejeitar comentário.' };
    }
}

// Exportar funções para uso no app.js
window.api = {
    login,
    signup,
    getUser,
    getSites,
    createSite,
    deleteSite,
    upgradePlan,
    getPendingComments,
    approveComment,
    rejectComment
};