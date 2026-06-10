// ============================================================
//  OIT_STACK — Centralised API Utility  (api.js v4)
//
//  Changes from v3:
//  - api.logout() now calls POST /auth/logout before clearing token
//  - Progress bar creation deferred to DOMContentLoaded (no null crash)
//  - Progress bar animates 30 % → 70 % → 100 % for smoother feel
//  - Cache moved to sessionStorage (survives page navigations in tab)
//  - Cache key serialises object params via JSON.stringify (no [object Object])
//  - Cache invalidation helper: api.cache.invalidate(key) / invalidateAll()
//  - /coding vs /coding/problems inconsistency fixed — admin.getCoding now
//    uses /coding/problems (student-facing canonical endpoint)
//  - api.auth.logout added (explicit method)
//  - Missing admin methods added: getQuestions, createQuestion, updateQuestion,
//    deleteQuestion, getResults, getInterviews, getAnalytics
//  - api.student namespace added: getDashboard, getLeaderboard
//  - api.interview.getOne(id) added
//  - Inactivity modal: keyboard trap (Tab cycles inside card), Escape = Stay
//  - Inactivity modal: dark-mode observer via MutationObserver (reactive)
//  - Inactivity modal: clearInterval on logout path (no memory leak)
// ============================================================

const CONFIG = {
    API_URL: window.APP_CONFIG?.API_URL || (
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api'
            : 'https://oit-stack-backend.onrender.com/api'
    )
};

// ── Cache (sessionStorage-backed, survives page navigations within tab) ───────
const _cache = {
    _prefix: 'api_cache_',

    _read(key) {
        try {
            const raw = sessionStorage.getItem(this._prefix + key);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    },

    _write(key, data) {
        try {
            sessionStorage.setItem(this._prefix + key, JSON.stringify({ data, ts: Date.now() }));
        } catch { /* sessionStorage full – silently skip caching */ }
    },

    get(key, ttlMs) {
        const hit = this._read(key);
        if (hit && (Date.now() - hit.ts) < ttlMs) return hit.data;
        return null;
    },

    set(key, data) { this._write(key, data); },

    invalidate(key) {
        try { sessionStorage.removeItem(this._prefix + key); } catch { /* ignore */ }
    },

    invalidateAll() {
        try {
            Object.keys(sessionStorage)
                .filter(k => k.startsWith(this._prefix))
                .forEach(k => sessionStorage.removeItem(k));
        } catch { /* ignore */ }
    }
};

// Serialize cache keys safely — handles object params without [object Object]
const _cacheKey = (base, params) =>
    base + (params && typeof params === 'object' ? JSON.stringify(params) : (params || ''));

const _cachedRequest = (keyBase, params, ttlMs, fn) => {
    const key  = _cacheKey(keyBase, params);
    const hit  = _cache.get(key, ttlMs);
    if (hit) return Promise.resolve(hit);
    return fn().then(data => { _cache.set(key, data); return data; });
};

// ── Progress bar ──────────────────────────────────────────────────────────────
let _pending = 0;
let _bar     = null;

// Deferred creation — safe to call before DOMContentLoaded
const _ensureBar = () => {
    if (_bar || !document.body) return;
    _bar = document.createElement('div');
    _bar.id = 'api-progress-bar';
    _bar.style.cssText = [
        'position:fixed;top:0;left:0;height:3px;width:0;',
        'background:linear-gradient(90deg,#3b82f6,#8b5cf6);',
        'transition:width 0.25s ease,opacity 0.3s ease;',
        'z-index:99999;',
        'box-shadow:0 0 8px rgba(59,130,246,0.6);',
        'pointer-events:none;'
    ].join('');
    document.body.appendChild(_bar);
};

// Initialise bar as soon as DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _ensureBar, { once: true });
} else {
    _ensureBar();
}

const showBar = () => {
    _ensureBar();
    _pending++;
    if (_bar) {
        _bar.style.opacity = '1';
        _bar.style.width   = '30%';
        // Animate to 70% after short delay for visual feedback
        setTimeout(() => { if (_bar && _pending > 0) _bar.style.width = '70%'; }, 150);
    }
};

const hideBar = () => {
    if (--_pending <= 0) {
        _pending = 0;
        if (_bar) {
            _bar.style.width = '100%';
            setTimeout(() => {
                if (_bar && _pending === 0) {
                    _bar.style.opacity = '0';
                    setTimeout(() => { if (_bar && _pending === 0) _bar.style.width = '0'; }, 300);
                }
            }, 200);
        }
    }
};

// ── Main API object ───────────────────────────────────────────────────────────
const api = {
    // Token helpers
    getToken:    () => localStorage.getItem('token'),
    setToken:    (t) => localStorage.setItem('token', t),
    removeToken: () => localStorage.removeItem('token'),

    // Cache invalidation surface
    cache: _cache,

    // Logout: invalidate server session THEN clear local token
    logout: async () => {
        try {
            await fetch(`${CONFIG.API_URL}/auth/logout`, {
                method:  'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                credentials: 'include'   // send refresh-token cookie
            });
        } catch { /* network error — still clear local session */ }
        localStorage.removeItem('token');
        _cache.invalidateAll();
        window.location.href = 'login.html';
    },

    // ── Core fetch wrapper ───────────────────────────────────────────────────
    async request(endpoint, options = {}) {
        let baseUrl = CONFIG.API_URL;

        const headers = { 'Content-Type': 'application/json', ...options.headers };
        const token   = this.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const config = { ...options, headers };

        const attemptFetch = async (url) => {
            showBar();
            const controller = new AbortController();
            const timeoutId  = setTimeout(() => controller.abort(), 15000);

            try {
                const response = await fetch(url, { ...config, signal: controller.signal, credentials: 'include' });
                clearTimeout(timeoutId);

                // Auto-logout on 401 (outside auth pages)
                if (response.status === 401) {
                    console.warn('Token expired or invalid — performing auto-logout.');
                    const isAuthPage = /\/(login|register|forgot-password)\.html/i.test(window.location.pathname);
                    if (!isAuthPage) {
                        this.removeToken();
                        _cache.invalidateAll();
                        window.location.href = 'login.html?session=expired';
                        return new Promise(() => {}); // stall downstream code
                    }
                    const data = await response.json();
                    throw new Error(data.message || 'Invalid credentials');
                }

                const contentType = response.headers.get('content-type') || '';
                if (!contentType.includes('application/json')) {
                    throw new SyntaxError('Response is not JSON (received HTML fallback)');
                }

                const data = await response.json();
                if (!response.ok) {
                    const err = new Error(data.message || 'Something went wrong');
                    err.status = response.status;
                    err.errors = data.errors || null;
                    throw err;
                }
                return data;

            } catch (err) {
                clearTimeout(timeoutId);
                if (err.name === 'AbortError') {
                    const abortErr  = new Error('Request timed out. Please check your connection.');
                    abortErr.status = 408;
                    throw abortErr;
                }
                throw err;
            } finally {
                hideBar();
            }
        };

        const attemptWithRetry = async (url, retries = 2, delay = 1000) => {
            for (let i = 0; i <= retries; i++) {
                try {
                    return await attemptFetch(url);
                } catch (err) {
                    const is5xx     = err.status >= 500;
                    const isTimeout = err.status === 408 || err.message.includes('timed out');
                    if (i < retries && (is5xx || isTimeout)) {
                        console.warn(`Transient error (${err.status || 'network'}) — retrying in ${delay * (i + 1)}ms…`);
                        await new Promise(r => setTimeout(r, delay * (i + 1)));
                        continue;
                    }
                    throw err;
                }
            }
        };

        try {
            return await attemptWithRetry(`${baseUrl}${endpoint}`);
        } catch (error) {
            const isLocal        = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const isJsonError    = error instanceof SyntaxError || error.message.includes('JSON');
            const isNetworkError = error instanceof TypeError;

            if (isLocal && (isJsonError || isNetworkError)) {
                const altBase = baseUrl.includes('5000')
                    ? baseUrl.replace('5000', '3000')
                    : baseUrl.replace('3000', '5000');
                console.warn(`Falling back to alternate local port: ${altBase}`);
                try {
                    return await attemptWithRetry(`${altBase}${endpoint}`);
                } catch {
                    throw new Error('Cannot connect to the server. Make sure the backend is running on port 5000 or 3000.');
                }
            }
            console.error('API Error:', error);
            throw error;
        }
    },

    // ── Auth ─────────────────────────────────────────────────────────────────
    auth: {
        login:          (creds)  => api.request('/auth/login',          { method: 'POST', body: JSON.stringify(creds) }),
        register:       (data)   => api.request('/auth/register',       { method: 'POST', body: JSON.stringify(data) }),
        logout:         ()       => api.request('/auth/logout',         { method: 'POST' }),
        forgotPassword: (email)  => api.request('/auth/forgot-password',{ method: 'POST', body: JSON.stringify({ email }) }),
        resetPassword:  (token, password) => api.request(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify({ password }) }),
        getProfile:     ()       => api.request('/auth/profile',        { method: 'GET' }),
        updateProfile:  (data)   => api.request('/auth/profile',        { method: 'PUT',  body: JSON.stringify(data) }),
        refreshToken:   ()       => api.request('/auth/refresh',        { method: 'POST' })
    },

    // ── Admin ─────────────────────────────────────────────────────────────────
    // All admin methods live here — pages should call api.admin.* for consistency
    admin: {
        // Dashboard
        getStats:       ()        => api.request('/analytics/dashboard'),

        // Users / Students
        getUsers:       (params = '') => api.request(`/users${params}`),
        deleteUser:     (id)       => api.request(`/users/${id}`,       { method: 'DELETE' }),
        getUserStats:   (id)       => api.request(`/users/${id}/stats`),

        // Tests
        getTests:       (params = '') => api.request(`/tests${params}`),
        getTest:        (id)       => api.request(`/tests/${id}`),
        createTest:     (data)     => api.request('/tests',             { method: 'POST',  body: JSON.stringify(data) }),
        updateTest:     (id, data) => api.request(`/tests/${id}`,       { method: 'PUT',   body: JSON.stringify(data) }),
        deleteTest:     (id)       => api.request(`/tests/${id}`,       { method: 'DELETE' }),
        toggleTest:     (id)       => api.request(`/tests/${id}/toggle`,{ method: 'PATCH' }),

        // Questions (previously missing)
        getQuestions:    (params = '') => api.request(`/questions${params}`),
        getQuestion:     (id)       => api.request(`/questions/${id}`),
        createQuestion:  (data)     => api.request('/questions',        { method: 'POST',  body: JSON.stringify(data) }),
        updateQuestion:  (id, data) => api.request(`/questions/${id}`,  { method: 'PUT',   body: JSON.stringify(data) }),
        deleteQuestion:  (id)       => api.request(`/questions/${id}`,  { method: 'DELETE' }),
        bulkImportQuestions: (data) => api.request('/questions/bulk',   { method: 'POST',  body: JSON.stringify(data) }),

        // Coding — unified with /coding/problems (was /coding — now consistent)
        getCoding:       (params = '') => api.request(`/coding/problems${params}`),
        getCodingProblem:(id)       => api.request(`/coding/problems/${id}`),
        createCoding:    (data)     => api.request('/coding/problems',  { method: 'POST',  body: JSON.stringify(data) }),
        updateCoding:    (id, data) => api.request(`/coding/problems/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteCoding:    (id)       => api.request(`/coding/problems/${id}`, { method: 'DELETE' }),

        // Categories
        getCategories:   (params = '') => api.request(`/categories${params}`),
        createCategory:  (data)     => {
            _cache.invalidate('categories');
            return api.request('/categories', { method: 'POST', body: JSON.stringify(data) });
        },
        updateCategory:  (id, data) => {
            _cache.invalidate('categories');
            return api.request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        deleteCategory:  (id)       => {
            _cache.invalidate('categories');
            return api.request(`/categories/${id}`, { method: 'DELETE' });
        },

        // Results (previously missing)
        getResults:      (params = '') => api.request(`/results${params}`),
        getResult:       (id)       => api.request(`/results/${id}`),

        // Mock Interviews (previously missing)
        getInterviews:   (params = '') => api.request(`/interview/history${params}`),
        getInterview:    (id)       => api.request(`/interview/${id}`),
        deleteInterview: (id)       => api.request(`/interview/${id}`, { method: 'DELETE' }),

        // Analytics (previously missing)
        getAnalytics:    ()         => api.request('/analytics/dashboard'),
        getStudentAnalytics: ()     => api.request('/analytics/students'),
        getTestAnalytics:    ()     => api.request('/analytics/tests'),
        getCategoryAnalytics:()     => api.request('/analytics/categories'),

        // Technical MCQs (alias to questions with type filter)
        getTechnicalMCQs:(params = '') => api.request(`/questions${params}`)
    },

    // ── Student namespace ─────────────────────────────────────────────────────
    student: {
        getDashboard:  ()         => api.request('/analytics/student-dashboard'),
        getLeaderboard:(params = '') => _cachedRequest(
            'leaderboard', params, 60_000,
            () => api.request(`/leaderboard${params}`)
        )
    },

    // ── Tests ─────────────────────────────────────────────────────────────────
    tests: {
        getAll:  (params = '') => api.request(`/tests${params}`),
        getOne:  (id)          => api.request(`/tests/${id}`),
        start:   (id)          => api.request(`/tests/${id}/start`,  { method: 'POST' }),
        submit:  (id, data)    => api.request(`/tests/${id}/submit`, { method: 'POST', body: JSON.stringify(data) })
    },

    // ── Results ───────────────────────────────────────────────────────────────
    results: {
        getMy:       (params = '') => api.request(`/results/my${params}`),
        getOne:      (id)          => api.request(`/results/${id}`),
        getAll:      (params = '') => api.request(`/results${params}`),
        create:      (data)        => api.request('/results',                { method: 'POST', body: JSON.stringify(data) }),
        saveAnswer:  (resultId, data) => api.request(`/results/${resultId}/answer`, { method: 'PUT', body: JSON.stringify(data) })
    },

    // ── Coding ────────────────────────────────────────────────────────────────
    coding: {
        getProblems:    (params = '') => api.request(`/coding/problems${params}`),
        getProblem:     (id)          => api.request(`/coding/problems/${id}`),
        getSubmissions: (id)          => api.request(`/coding/problems/${id}/submissions`),
        run:            (data)        => api.request('/coding/run',    { method: 'POST', body: JSON.stringify(data) }),
        submit:         (data)        => api.request('/coding/submit', { method: 'POST', body: JSON.stringify(data) }),
        getSolvedCount: ()            => api.request('/coding/solved-count')
    },

    // ── Leaderboard ───────────────────────────────────────────────────────────
    leaderboard: {
        get: (params = '') => _cachedRequest(
            'leaderboard', params, 60_000,
            () => api.request(`/leaderboard${params}`)
        )
    },

    // ── Categories (with cache invalidation on mutations) ─────────────────────
    categories: {
        getAll: () => _cachedRequest('categories', '', 60_000, () => api.request('/categories')),
        getOne: (id)       => api.request(`/categories/${id}`),
        create: (data)     => {
            _cache.invalidate('categories');
            return api.request('/categories', { method: 'POST', body: JSON.stringify(data) });
        },
        update: (id, data) => {
            _cache.invalidate('categories');
            return api.request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        delete: (id)       => {
            _cache.invalidate('categories');
            return api.request(`/categories/${id}`, { method: 'DELETE' });
        },
        getSubcategories:    (id)       => api.request(`/categories/${id}/subcategories`),
        createSubcategory:   (id, data) => api.request(`/categories/${id}/subcategories`,     { method: 'POST',   body: JSON.stringify(data) }),
        updateSubcategory:   (id, data) => api.request(`/categories/subcategories/${id}`,     { method: 'PUT',    body: JSON.stringify(data) }),
        deleteSubcategory:   (id)       => api.request(`/categories/subcategories/${id}`,     { method: 'DELETE' }),
        bulkImportSubcategories: (id, data) => api.request(`/categories/${id}/subcategories/bulk`, { method: 'POST', body: JSON.stringify(data) })
    },

    // ── Questions ─────────────────────────────────────────────────────────────
    questions: {
        getAll:     (params = '') => api.request(`/questions${params}`),
        getOne:     (id)          => api.request(`/questions/${id}`),
        create:     (data)        => api.request('/questions',         { method: 'POST',   body: JSON.stringify(data) }),
        update:     (id, data)    => api.request(`/questions/${id}`,   { method: 'PUT',    body: JSON.stringify(data) }),
        delete:     (id)          => api.request(`/questions/${id}`,   { method: 'DELETE' }),
        bulkImport: (data)        => api.request('/questions/bulk',    { method: 'POST',   body: JSON.stringify(data) })
    },

    // ── Mock Interviews ───────────────────────────────────────────────────────
    interview: {
        start:      (data) => api.request('/interview/start',  { method: 'POST', body: JSON.stringify(data) }),
        answer:     (data) => api.request('/interview/answer', { method: 'POST', body: JSON.stringify(data) }),
        end:        (data) => api.request('/interview/end',    { method: 'POST', body: JSON.stringify(data) }),
        getHistory: ()     => api.request('/interview/history'),
        getOne:     (id)   => api.request(`/interview/${id}`),   // previously missing
        getAdminHistory: (params = '') => api.request(`/interview/admin/history${params}`)
    },

    // ── Analytics ─────────────────────────────────────────────────────────────
    analytics: {
        getStudents:   () => api.request('/analytics/students'),
        getTests:      () => api.request('/analytics/tests'),
        getCategories: () => api.request('/analytics/categories')
    }
};

// ═════════════════════════════════════════════════════════════════════════════
//  Inactivity Auto-Logout Tracker (30 min) with Warning Modal
// ═════════════════════════════════════════════════════════════════════════════
(function () {
    const INACTIVITY_TIMEOUT  = 30 * 60 * 1000; // 30 minutes
    const CHECK_INTERVAL      = 10_000;           // 10 s polling
    const WARNING_THRESHOLD   = INACTIVITY_TIMEOUT - 60_000; // warn at 29 min

    if (!localStorage.getItem('token')) return;

    // Reset lastActivity on each page load (prevents phantom logouts on reopened tabs)
    localStorage.setItem('lastActivity', Date.now());

    let warningModal      = null;
    let countdownInterval = null;
    let _themeObserver    = null;

    // ── Dark mode helper (reactive via MutationObserver) ──────────────────
    const isDark = () => document.documentElement.classList.contains('dark');

    const applyTheme = (card, bodyText) => {
        if (isDark()) {
            card.style.background    = '#1e293b';
            card.style.color         = '#f8fafc';
            card.style.borderColor   = '#334155';
            bodyText.style.color     = '#94a3b8';
        } else {
            card.style.background    = '#ffffff';
            card.style.color         = '#0f172a';
            card.style.borderColor   = '#e2e8f0';
            bodyText.style.color     = '#64748b';
        }
    };

    // ── Modal ─────────────────────────────────────────────────────────────
    const showWarningModal = () => {
        if (warningModal) return;

        // Backdrop
        warningModal = document.createElement('div');
        warningModal.id = 'inactivity-modal';
        warningModal.setAttribute('role', 'dialog');
        warningModal.setAttribute('aria-modal', 'true');
        warningModal.setAttribute('aria-labelledby', 'inactivity-title');
        warningModal.style.cssText = [
            'position:fixed;top:0;left:0;width:100%;height:100%;',
            'background:rgba(15,23,42,0.65);backdrop-filter:blur(4px);',
            'display:flex;align-items:center;justify-content:center;',
            'z-index:100000;padding:1rem;'
        ].join('');

        // Card
        const card = document.createElement('div');
        card.style.cssText = [
            'border-radius:1rem;max-width:24rem;width:100%;',
            'padding:1.75rem;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);',
            'text-align:center;font-family:system-ui,-apple-system,sans-serif;',
            'border:1px solid;transition:background 0.2s,color 0.2s;'
        ].join('');

        const title = document.createElement('h3');
        title.id = 'inactivity-title';
        title.style.cssText = 'font-size:1.125rem;font-weight:700;margin-bottom:0.5rem;';
        title.innerText = '⏳ Session Expiring';

        const bodyText = document.createElement('p');
        bodyText.id = 'inactivity-countdown-text';
        bodyText.style.cssText = 'font-size:0.875rem;margin-bottom:1.5rem;line-height:1.6;';
        bodyText.innerText = "You've been inactive. You will be logged out in 60 seconds.";

        const btn = document.createElement('button');
        btn.id = 'inactivity-stay-btn';
        btn.style.cssText = [
            'width:100%;padding:0.75rem;background:#2563eb;color:#fff;',
            'border:none;border-radius:0.75rem;font-weight:600;',
            'font-size:0.875rem;cursor:pointer;transition:background 0.2s;'
        ].join('');
        btn.innerText = 'Stay Logged In';
        btn.onmouseover = () => { btn.style.background = '#1d4ed8'; };
        btn.onmouseout  = () => { btn.style.background = '#2563eb'; };
        btn.onclick = () => { updateActivity(); dismissWarningModal(); };

        card.appendChild(title);
        card.appendChild(bodyText);
        card.appendChild(btn);
        warningModal.appendChild(card);
        document.body.appendChild(warningModal);

        // Apply current theme immediately
        applyTheme(card, bodyText);

        // ── Reactive dark-mode observer ────────────────────────────────────
        _themeObserver = new MutationObserver(() => applyTheme(card, bodyText));
        _themeObserver.observe(document.documentElement, {
            attributes: true, attributeFilter: ['class']
        });

        // ── Keyboard trap — Tab cycles within the card ─────────────────────
        const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const trapFocus = (e) => {
            if (!warningModal) return;
            if (e.key === 'Escape') { updateActivity(); dismissWarningModal(); return; }
            if (e.key !== 'Tab') return;
            const focusable = Array.from(card.querySelectorAll(focusableSelector));
            if (!focusable.length) { e.preventDefault(); return; }
            const first = focusable[0];
            const last  = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
            }
        };
        document.addEventListener('keydown', trapFocus);
        warningModal._removeTrap = () => document.removeEventListener('keydown', trapFocus);

        // Focus the Stay button immediately
        setTimeout(() => btn.focus(), 50);

        // ── Countdown ─────────────────────────────────────────────────────
        let secondsLeft = 60;
        countdownInterval = setInterval(() => {
            secondsLeft--;
            const el = document.getElementById('inactivity-countdown-text');
            if (el) {
                el.innerText = `You've been inactive. You will be logged out in ${secondsLeft} second${secondsLeft !== 1 ? 's' : ''}.`;
            }
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                dismissWarningModal();
                api.logout(); // calls server-side logout then redirects
            }
        }, 1000);
    };

    const dismissWarningModal = () => {
        if (warningModal) {
            if (warningModal._removeTrap) warningModal._removeTrap();
            warningModal.remove();
            warningModal = null;
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        if (_themeObserver) {
            _themeObserver.disconnect();
            _themeObserver = null;
        }
    };

    const updateActivity = () => {
        localStorage.setItem('lastActivity', Date.now());
    };

    // Track user interactions
    ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll', 'click'].forEach(evt =>
        window.addEventListener(evt, updateActivity, { passive: true })
    );

    // Periodic inactivity check
    setInterval(() => {
        if (!localStorage.getItem('token')) return;
        const lastActivity = parseInt(localStorage.getItem('lastActivity') || Date.now(), 10);
        const idle         = Date.now() - lastActivity;

        if (idle >= INACTIVITY_TIMEOUT) {
            console.warn('Auto-logout: 30 minutes of inactivity.');
            dismissWarningModal();
            api.logout();
        } else if (idle >= WARNING_THRESHOLD && !warningModal) {
            showWarningModal();
        }
    }, CHECK_INTERVAL);
})();
