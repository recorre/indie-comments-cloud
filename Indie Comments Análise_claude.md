# Indie Comments - Análise Técnica e Recomendações

## Resumo Executivo

Arquitetura híbrida (proxy + direto) é apropriada para o caso de uso. MVP tecnicamente viável com **ressalvas críticas de segurança** que bloqueiam lançamento. Performance adequada até ~1000 sites.

**Status:** ⚠️ Requer correções de segurança antes de produção

---

## ✅ Decisões Acertadas

### Arquitetura Híbrida
- **Dashboard via proxy:** Protege API key master, operações sensíveis isoladas
- **Widget direto:** Evita CORS, reduz latência para sites externos
- **Separação clara:** Admin vs público bem delimitados

### Segurança em Camadas
- Moderação obrigatória (`visible=false` default)
- Rate limiting básico (3s cooldown)
- Validação de email e limites por plano
- API keys por site (não expõe master key)

### Performance
- Cache de 5min no widget (adequado para comentários)
- Paginação com `limit=50` (previne sobrecarga)
- Fetch condicional com timestamps

---

## 🔴 Problemas Críticos (BLOCKERS)

### 1. Senhas em Plain Text
**Severidade:** CRÍTICA  
**Arquivo:** `api.js:56`  
**Problema:** `password_hash = password` armazena texto plano  
**Impacto:** Vazamento de banco expõe todas as senhas  
**Status:** ❌ INACEITÁVEL para produção

### 2. API Keys Públicas Expostas
**Severidade:** ALTA  
**Arquivo:** `indie_comments.js` (embed code)  
**Problema:** Chave visível no HTML do site cliente  
**Impacto:** Spam de comentários, abuso de rate limits  
**Status:** ⚠️ Risco calculado, mas requer mitigação

### 3. Consulta Ineficiente de Sites
**Severidade:** MÉDIA  
**Arquivo:** `indie_comments.js:45`  
**Problema:** `GET /read/sites?limit=100` busca todos os sites  
**Impacto:** O(n) linear, inviável com >1000 sites  
**Status:** ⚠️ Conhecido, roadmap para resolver

### 4. Dependência Externa para IP
**Severidade:** BAIXA  
**Arquivo:** `indie_comments.js:85`  
**Problema:** `ipify.org` é ponto único de falha  
**Impacto:** Comentários param se serviço cair  
**Status:** ⚠️ Tem fallback, mas subótimo

---

## 📋 Recomendações por Prioridade

### P0 - Bloqueadores (Antes do Lançamento)
1. **Implementar hash bcrypt no backend** (server.js)
2. **Adicionar validação de domínio** (widget verifica origin vs site_url)
3. **Aumentar cache de sites** (5min → 30min)
4. **Sanitização de HTML** nos comentários (XSS)

### P1 - Importantes (Primeiras 2 Semanas)
1. **Endpoint dedicado** `GET /read/sites?api_key={key}` no NoCodeBackend
2. **Rate limiting robusto** (Redis + IP tracking)
3. **Logs estruturados** (Winston/Pino)
4. **Error handling consistente** (classe APIError)

### P2 - Melhorias (Após Tração)
1. **Migrar para JWT** no dashboard
2. **CDN para widget.js** (Cloudflare/jsDelivr)
3. **CAPTCHA** em produção (hCaptcha/Turnstile)
4. **Analytics por site** (volume de comentários)

### P3 - Escala (Futuro)
1. **Webhook de moderação** assíncrona
2. **Suporte a threads aninhados** (replies)
3. **Dashboard mobile app** (React Native)
4. **Multi-idioma** no widget

---

## 🎯 Métricas de Sucesso

| Métrica | Atual | Alvo P0 | Alvo P1 |
|---------|-------|---------|---------|
| **Senhas seguras** | ❌ Plain text | ✅ bcrypt | ✅ bcrypt |
| **API calls/site** | ~3 (ineficiente) | ~3 | 1 (endpoint dedicado) |
| **Cache hit rate** | ~60% (5min) | ~80% (30min) | ~90% (1h) |
| **Uptime widget** | ~95% (ipify) | ~99% (próprio IP) | ~99.9% |
| **Escala suportada** | ~100 sites | ~1000 sites | ~10k sites |

---

## 🔍 Análise de Riscos

### Alto Risco
- **Vazamento de senhas:** Impacto 10/10, Probabilidade 8/10
- **Spam de comentários:** Impacto 7/10, Probabilidade 6/10

### Médio Risco
- **Degradação com escala:** Impacto 8/10, Probabilidade 4/10 (<1000 sites)
- **Indisponibilidade ipify:** Impacto 5/10, Probabilidade 3/10

### Baixo Risco
- **CORS issues:** Impacto 6/10, Probabilidade 1/10 (bem resolvido)
- **Rate limit abuse:** Impacto 4/10, Probabilidade 5/10 (moderação mitiga)

---

## 📊 Avaliação Final

| Dimensão | Nota | Comentário |
|----------|------|------------|
| **Arquitetura** | 8/10 | Híbrido proxy/direto é elegante |
| **Segurança** | 4/10 | Plain text passwords impedem lançamento |
| **Performance** | 7/10 | Adequada para MVP, gargalos conhecidos |
| **Escalabilidade** | 6/10 | Linear até ~1000 sites |
| **Manutenibilidade** | 8/10 | Código limpo, bem comentado |

**Média Ponderada: 6.6/10**

---

## ⏱️ Estimativa de Implementação

### Sprint 1 (Bloqueadores) - 8h
- Hash de senhas: 2h
- Validação de domínio: 2h
- Sanitização HTML: 1h
- Testes de segurança: 3h

### Sprint 2 (Importantes) - 16h
- Endpoint dedicado: 4h (depende NoCodeBackend)
- Rate limiting: 4h
- Logs estruturados: 2h
- Error handling: 3h
- Testes integração: 3h

### Sprint 3 (Melhorias) - 24h
- Migração JWT: 8h
- CDN setup: 2h
- CAPTCHA: 4h
- Analytics: 6h
- Documentação: 4h

---

## 🚀 Plano de Ação Imediato

```
1. ✅ Implementar bcrypt no server.js (P0)
2. ✅ Validação de domínio no widget (P0)
3. ✅ Aumentar cache para 30min (P0)
4. ✅ Sanitizar HTML nos comentários (P0)
5. ⏳ Deploy staging + testes (P0)
6. ⏳ Code review de segurança (P0)
7. ⏳ Lançamento beta fechado (P1)
```

**Tempo estimado P0:** 1 dia útil  
**Bloqueio para produção:** Apenas item #1 (bcrypt)

---

## 📝 Notas Finais

**Pronto para MVP?** ✅ SIM (após P0)  
**Pronto para produção?** ⚠️ NÃO (requer P0 + P1)  
**Pronto para escala?** ❌ NÃO (requer P2)

O projeto demonstra boas práticas arquiteturais. A maioria dos problemas são otimizações progressivas, exceto **senhas em plain text** que é bloqueador absoluto.

**Recomendação:** Implemente P0 esta semana, lance beta fechado com 10-20 early adopters, itere com feedback real antes do lançamento público.

---

## Anexo: Implementações de Código

### A1. Hash de Senhas no Backend

```javascript
// server.js - Adicionar rota específica para signup
const bcrypt = require('bcryptjs');

app.post('/api/proxy/create/users', async (req, res) => {
  try {
    const { password_hash, ...userData } = req.body;
    
    // Hash da senha antes de enviar ao NoCodeBackend
    const hashedPassword = await bcrypt.hash(password_hash, 10);
    
    const targetUrl = `${NOCODEBACKEND_BASE_URL}/create/users`;
    const headers = {
      'Content-Type': 'application/json',
      'Instance': INSTANCE_NAME,
      'Authorization': `Bearer ${NOCODEBACKEND_API_KEY}`
    };
    
    const proxyResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        ...userData,
        password_hash: hashedPassword
      })
    });
    
    const responseData = await proxyResponse.json();
    res.status(proxyResponse.status).json(responseData);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Rota específica para login com verificação bcrypt
app.post('/api/proxy/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário por email
    const targetUrl = `${NOCODEBACKEND_BASE_URL}/read/users?email=${encodeURIComponent(email)}`;
    const headers = {
      'Content-Type': 'application/json',
      'Instance': INSTANCE_NAME,
      'Authorization': `Bearer ${NOCODEBACKEND_API_KEY}`
    };
    
    const proxyResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: headers
    });
    
    const responseData = await proxyResponse.json();
    
    if (responseData.data.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = responseData.data[0];
    
    // Comparar senha com hash
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Retornar usuário sem senha
    const { password_hash, ...userWithoutPassword } = user;
    res.json({ status: 'success', data: [userWithoutPassword] });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});
```

```javascript
// api.js - Atualizar funções de signup e login
async function signup(name, email, password) {
    if (!isValidEmail(email)) {
        return { success: false, error: 'Email inválido.' };
    }
    if (password.length < 6) {
        return { success: false, error: 'A senha deve ter pelo menos 6 caracteres.' };
    }
    
    try {
        // Chamar rota específica de signup
        const createRes = await apiCall('/create/users', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password_hash: password  // Backend vai fazer hash
            })
        });
        
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

async function login(email, password) {
    if (!isValidEmail(email)) {
        return { success: false, error: 'Email inválido.' };
    }
    
    try {
        // Chamar rota específica de login
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
        return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
}
```

### A2. Validação de Domínio no Widget

```javascript
// indie_comments.js - Adicionar validação de origem
async function validateOrigin(site) {
    try {
        const currentHostname = window.location.hostname;
        const siteUrl = new URL(site.site_url);
        const siteHostname = siteUrl.hostname;
        
        // Permitir subdomínios
        const isValidOrigin = currentHostname === siteHostname || 
                             currentHostname.endsWith('.' + siteHostname);
        
        if (!isValidOrigin) {
            console.warn(`Indie Comments: Domain mismatch. Expected ${siteHostname}, got ${currentHostname}`);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Indie Comments: Origin validation failed', error);
        return false;
    }
}

// Atualizar função init()
async function init() {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) {
        console.error(`Indie Comments: Container #${CONTAINER_ID} não encontrado.`);
        return;
    }
    
    const scriptTag = document.querySelector('script[src*="indie_comments.js"]');
    const apiKey = scriptTag?.dataset.apiKey;
    
    if (!apiKey) {
        container.innerHTML = '<div class="alert alert-error">Erro: Chave da API (data-api-key) não encontrada.</div>';
        return;
    }
    
    injectCSS();
    container.innerHTML = '<div class="loading">Carregando comentários...</div>';
    
    try {
        const site = await getSiteByApiKey(apiKey);
        if (!site) {
            throw new Error('Chave da API inválida.');
        }
        
        // NOVA: Validar origem
        const isValidOrigin = await validateOrigin(site);
        if (!isValidOrigin) {
            throw new Error('Domínio não autorizado para esta chave API.');
        }
        
        // ... resto do código
    } catch (error) {
        console.error('Indie Comments Error:', error);
        container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
}
```

### A3. Sanitização de HTML

```javascript
// indie_comments.js - Adicionar função de sanitização
function sanitizeHTML(text) {
    const temp = document.createElement('div');
    temp.textContent = text;  // textContent escapa HTML automaticamente
    return temp.innerHTML;
}

// Atualizar renderWidget()
function renderWidget(container, comments, site) {
    const isSupporter = site.userPlan === 'paid';
    
    const commentsHtml = comments.length > 0 
        ? comments.map(comment => `
            <li class="comment">
                <div class="comment-author">
                    ${sanitizeHTML(comment.author_name)}
                    <span class="comment-timestamp">
                        ${new Date(comment.created_at).toLocaleDateString('pt-BR')}
                    </span>
                </div>
                <div class="comment-message">
                    ${sanitizeHTML(comment.message)}
                </div>
            </li>
        `).join('')
        : '<p>Seja o primeiro a comentar!</p>';
    
    // ... resto do código
}
```

### A4. Captura de IP no Backend

```javascript
// server.js - Adicionar endpoint para IP
app.get('/api/client-ip', (req, res) => {
  // Ordem de prioridade: CF-Connecting-IP, X-Forwarded-For, RemoteAddress
  const ip = req.headers['cf-connecting-ip'] || 
             req.headers['x-forwarded-for']?.split(',')[0].trim() ||
             req.headers['x-real-ip'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress;
  
  res.json({ ip: ip || '0.0.0.0' });
});
```

```javascript
// indie_comments.js - Usar endpoint próprio
async function getClientIP() {
    try {
        // Tentar backend próprio primeiro (não funciona em sites externos)
        const response = await fetch(API_BASE_URL + '/client-ip');
        const data = await response.json();
        return data.ip;
    } catch {
        // Fallback para ipify
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return '0.0.0.0';  // Último fallback
        }
    }
}
```

### A5. Error Handling Robusto

```javascript
// api.js - Classe de erro customizada
class APIError extends Error {
    constructor(message, code, details = null) {
        super(message);
        this.name = 'APIError';
        this.code = code;
        this.details = details;
    }
}

// Atualizar apiCall()
async function apiCall(endpoint, options = {}) {
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

// Exemplo de uso
async function login(email, password) {
    try {
        const usersRes = await apiCall(`/read/users?email=${encodeURIComponent(email)}`);
        // ...
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
```

### A6. Aumento de Cache

```javascript
// indie_comments.js - Aumentar duração do cache
const SITE_CACHE = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos (antes: 5 min)

async function getSiteByApiKey(apiKey) {
    // Verificar cache
    if (SITE_CACHE[apiKey] &&
        Date.now() - SITE_CACHE[apiKey].timestamp < CACHE_DURATION) {
        console.log('Indie Comments: Cache hit para API key');
        return SITE_CACHE[apiKey].data;
    }
    
    console.log('Indie Comments: Cache miss, buscando da API');
    
    // Buscar da API com paginação aumentada
    const allSitesRes = await apiCall('/read/sites?limit=200&includeTotal=true');
    const site = allSitesRes.data.find(s => s.api_key === apiKey);
    
    if (site) {
        SITE_CACHE[apiKey] = { data: site, timestamp: Date.now() };
    }
    
    return site;
}
```

### A7. Rate Limiting Robusto (Opcional - Requer Redis)

```javascript
// server.js - Rate limiting com Redis
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

async function rateLimitMiddleware(req, res, next) {
  const ip = req.headers['cf-connecting-ip'] || 
             req.headers['x-forwarded-for']?.split(',')[0].trim() ||
             req.connection.remoteAddress;
  
  const key = `ratelimit:${ip}`;
  const limit = 60;  // 60 requests
  const window = 60; // por minuto
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    if (current > limit) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: await redis.ttl(key)
      });
    }
    
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
    
    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    next(); // Fail open em caso de erro
  }
}

// Aplicar apenas em rotas públicas
app.use('/api/proxy/create/comments', rateLimitMiddleware);
```
