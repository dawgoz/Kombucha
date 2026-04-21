// ===========================
// Admin Panel – Flavour CRUD (API-backed)
// ===========================

const API = '/api';
const AUTH_KEY = 'kana_admin_token';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

// ===========================
// Auth
// ===========================
const loginGate = document.getElementById('loginGate');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const btnLogout = document.getElementById('btnLogout');

function getToken() {
    return sessionStorage.getItem(AUTH_KEY);
}

async function showAdmin() {
    loginGate.style.display = 'none';
    adminPanel.style.display = 'block';
    await renderList();
}

// Auto-login if token still valid
if (getToken()) {
    showAdmin();
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    try {
        const res = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput.value })
        });
        if (!res.ok) {
            loginError.textContent = 'Incorrect password';
            passwordInput.value = '';
            passwordInput.focus();
            return;
        }
        const { token } = await res.json();
        sessionStorage.setItem(AUTH_KEY, token);
        await showAdmin();
    } catch {
        loginError.textContent = 'Connection error';
    }
});

btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    adminPanel.style.display = 'none';
    loginGate.style.display = 'flex';
    passwordInput.value = '';
});

// ===========================
// API helpers
// ===========================
async function apiFetch(url, opts = {}) {
    const token = getToken();
    if (token) {
        opts.headers = { ...opts.headers, 'X-Admin-Token': token };
    }
    const res = await fetch(url, opts);
    if (res.status === 401) {
        sessionStorage.removeItem(AUTH_KEY);
        adminPanel.style.display = 'none';
        loginGate.style.display = 'flex';
        loginError.textContent = 'Session expired. Please log in again.';
        throw new Error('Unauthorized');
    }
    return res;
}

async function getFlavours() {
    const res = await fetch(`${API}/flavours`);
    return res.json();
}

// ===========================
// Modal
// ===========================
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const btnAddFlavour = document.getElementById('btnAddFlavour');
const btnCancel = document.getElementById('btnCancel');
const flavourForm = document.getElementById('flavourForm');
const flavourIdInput = document.getElementById('flavourId');

const nameEnInput = document.getElementById('nameEn');
const nameLtInput = document.getElementById('nameLt');
const descEnInput = document.getElementById('descEn');
const descLtInput = document.getElementById('descLt');
const badgeEnInput = document.getElementById('badgeEn');
const badgeLtInput = document.getElementById('badgeLt');
const accentColorInput = document.getElementById('accentColor');
const colorHex = document.getElementById('colorHex');
const imageInput = document.getElementById('imageInput');
const imagePreviewWrap = document.getElementById('imagePreviewWrap');
const imagePreview = document.getElementById('imagePreview');
const btnRemoveImage = document.getElementById('btnRemoveImage');

let currentImageFile = null;
let existingImage = '';
let removeImageFlag = false;

function openModal(flavour = null) {
    flavourForm.reset();
    currentImageFile = null;
    existingImage = '';
    removeImageFlag = false;
    imagePreviewWrap.style.display = 'none';
    imageInput.value = '';

    if (flavour) {
        modalTitle.textContent = 'Edit Flavour';
        flavourIdInput.value = flavour.id;
        nameEnInput.value = flavour.nameEn;
        nameLtInput.value = flavour.nameLt;
        descEnInput.value = flavour.descEn;
        descLtInput.value = flavour.descLt;
        badgeEnInput.value = flavour.badgeEn || '';
        badgeLtInput.value = flavour.badgeLt || '';
        accentColorInput.value = flavour.accent || '#e8a87c';
        colorHex.textContent = flavour.accent || '#e8a87c';
        if (flavour.image) {
            existingImage = flavour.image;
            imagePreview.src = flavour.image;
            imagePreviewWrap.style.display = 'block';
        }
    } else {
        modalTitle.textContent = 'Add Flavour';
        flavourIdInput.value = '';
        accentColorInput.value = '#e8a87c';
        colorHex.textContent = '#e8a87c';
    }

    modalOverlay.classList.add('open');
}

function closeModal() {
    modalOverlay.classList.remove('open');
}

btnAddFlavour.addEventListener('click', () => openModal());
modalClose.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

accentColorInput.addEventListener('input', () => {
    colorHex.textContent = accentColorInput.value;
});

// Image handling
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
        alert('Image is too large. Max 5 MB.');
        imageInput.value = '';
        return;
    }

    currentImageFile = file;
    removeImageFlag = false;
    imagePreview.src = URL.createObjectURL(file);
    imagePreviewWrap.style.display = 'block';
});

btnRemoveImage.addEventListener('click', () => {
    currentImageFile = null;
    removeImageFlag = true;
    imageInput.value = '';
    imagePreviewWrap.style.display = 'none';
});

// ===========================
// Save (Create / Update)
// ===========================
flavourForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const editId = flavourIdInput.value ? parseInt(flavourIdInput.value, 10) : null;

    const formData = new FormData();
    formData.append('nameEn', nameEnInput.value.trim());
    formData.append('nameLt', nameLtInput.value.trim());
    formData.append('descEn', descEnInput.value.trim());
    formData.append('descLt', descLtInput.value.trim());
    formData.append('badgeEn', badgeEnInput.value.trim());
    formData.append('badgeLt', badgeLtInput.value.trim());
    formData.append('accent', accentColorInput.value);

    if (currentImageFile) {
        formData.append('image', currentImageFile);
    } else if (!removeImageFlag && existingImage) {
        formData.append('existingImage', existingImage);
    }
    if (removeImageFlag) {
        formData.append('removeImage', 'true');
    }

    try {
        const url = editId ? `${API}/flavours/${editId}` : `${API}/flavours`;
        const method = editId ? 'PUT' : 'POST';
        const res = await apiFetch(url, { method, body: formData });

        if (!res.ok) {
            const err = await res.json();
            alert(err.error || 'Failed to save');
            return;
        }

        closeModal();
        await renderList();
    } catch (err) {
        if (err.message !== 'Unauthorized') alert('Connection error');
    }
});

// ===========================
// Delete
// ===========================
async function deleteFlavour(id) {
    if (!confirm('Delete this flavour?')) return;
    try {
        await apiFetch(`${API}/flavours/${id}`, { method: 'DELETE' });
        await renderList();
    } catch (err) {
        if (err.message !== 'Unauthorized') alert('Failed to delete');
    }
}

// ===========================
// Render List
// ===========================
const flavourList = document.getElementById('flavourList');
const flavourCount = document.getElementById('flavourCount');

async function renderList() {
    let flavours;
    try {
        flavours = await getFlavours();
    } catch {
        flavourList.innerHTML = '<div class="empty-state"><p>Failed to load flavours.</p></div>';
        return;
    }

    flavourCount.textContent = flavours.length;

    if (flavours.length === 0) {
        flavourList.innerHTML = '<div class="empty-state"><p>No flavours yet. Click "+ Add Flavour" to get started.</p></div>';
        return;
    }

    flavourList.innerHTML = flavours.map(f => {
        const thumbHtml = f.image
            ? `<img src="${escapeHtml(f.image)}" alt="${escapeHtml(f.nameEn)}">`
            : '<span class="placeholder-icon">🍵</span>';

        const badgeHtml = f.badgeEn
            ? `<span class="flavour-item-badge">${escapeHtml(f.badgeEn)}</span>`
            : '';

        return `
        <div class="flavour-item">
            <div class="flavour-item-thumb" style="background: ${escapeHtml(f.accent || '#eceae5')}">${thumbHtml}</div>
            <div class="flavour-item-info">
                <h4>${escapeHtml(f.nameEn)} / ${escapeHtml(f.nameLt)}</h4>
                <p>${escapeHtml(f.descEn)}</p>
            </div>
            ${badgeHtml}
            <div class="flavour-item-actions">
                <button class="btn-edit" title="Edit" data-id="${f.id}">✏️</button>
                <button class="btn-delete" title="Delete" data-id="${f.id}">🗑️</button>
            </div>
        </div>`;
    }).join('');

    flavourList.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id, 10);
            const all = await getFlavours();
            const flavour = all.find(f => f.id === id);
            if (flavour) openModal(flavour);
        });
    });

    flavourList.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id, 10);
            deleteFlavour(id);
        });
    });
}

// ===========================
// Utility
// ===========================
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
