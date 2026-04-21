const express = require('express');
const initSqlJs = require('sql.js');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// ===========================
// Config
// ===========================
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kana2026';
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DB_PATH = path.join(__dirname, 'kombucha.db');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// ===========================
// Database (sql.js – pure JS SQLite)
// ===========================
let db;

function saveDb() {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
}

async function initDb() {
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    db.run(`
        CREATE TABLE IF NOT EXISTS flavours (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name_en     TEXT NOT NULL,
            name_lt     TEXT NOT NULL,
            desc_en     TEXT NOT NULL DEFAULT '',
            desc_lt     TEXT NOT NULL DEFAULT '',
            badge_en    TEXT NOT NULL DEFAULT '',
            badge_lt    TEXT NOT NULL DEFAULT '',
            accent      TEXT NOT NULL DEFAULT '#e8a87c',
            image       TEXT NOT NULL DEFAULT '',
            created_at  TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);

    // Seed defaults if table is empty
    const [{ values: [[count]] }] = db.exec('SELECT COUNT(*) FROM flavours');
    if (count === 0) {
        const stmt = db.prepare(`
            INSERT INTO flavours (name_en, name_lt, desc_en, desc_lt, badge_en, badge_lt, accent, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const seeds = [
            ['Ginger Lemon', 'Imbieras ir citrina', 'A zesty, warming classic. Fresh ginger root and bright lemon create a perfectly balanced, invigorating brew.', 'Aštrus, šildantis klasikinis skonis. Šviežia imbieriaus šaknis ir ryški citrina sukuria tobulai subalansuotą, gaivų gėrimą.', 'Classic', 'Klasikinis', '#e8a87c', 'images/ginger-lemon.jpg'],
            ['Lavender Blueberry', 'Levanda ir mėlynės', 'Floral and fruity. Calming Lithuanian lavender meets sweet, antioxidant-rich wild blueberries.', 'Gėlėtas ir vaisingas. Raminanti lietuviška levanda susitinka su saldžiomis, antioksidantais turtingomis miško mėlynėmis.', 'Popular', 'Populiarus', '#d4a5e5', 'images/lavender-blueberry.jpg'],
            ['Mint Cucumber', 'Mėta ir agurkas', 'Cool and crisp. Garden-fresh mint and cucumber make this the ultimate summer refresher.', 'Vėsus ir gaivus. Šviežia sodo mėta ir agurkas padaro šį gėrimą idealia vasaros gaiva.', 'Refreshing', 'Gaivus', '#85cdca', 'images/mint-cucumber.jpg'],
            ['Turmeric Mango', 'Ciberžolė ir mangas', 'Golden and tropical. Anti-inflammatory turmeric pairs beautifully with sweet, luscious mango.', 'Auksinis ir tropinis. Priešuždegiminis ciberžolė puikiai dera su saldžiu, sultingu mangu.', 'Exotic', 'Egzotiškas', '#f5b971', 'images/turmeric-mango.jpg'],
            ['Raspberry Rose', 'Avietė ir rožė', 'Romantic and bold. Tart raspberries and delicate rose petals create an elegant, aromatic flavour.', 'Romantiškas ir ryškus. Rūgščios avietės ir švelnūs rožių žiedlapiai sukuria elegantišką, aromatingą skonį.', 'New', 'Naujiena', '#f7a4a4', 'images/raspberry-rose.jpg'],
            ['Apple Cinnamon', 'Obuolys ir cinamonas', 'Cozy and comforting. Lithuanian apples and warming cinnamon make this the perfect autumn companion.', 'Jaukus ir šildantis. Lietuviški obuoliai ir šildantis cinamonas padaro šį gėrimą tobulu rudens palydovu.', 'Seasonal', 'Sezoninis', '#a8d5a2', 'images/apple-cinnamon.jpg']
        ];
        for (const row of seeds) {
            stmt.run(row);
        }
        stmt.free();
        saveDb();
    }
}

// Helper to get all flavours as array of objects
function getAllFlavours() {
    const results = db.exec('SELECT * FROM flavours ORDER BY id');
    if (results.length === 0) return [];
    const cols = results[0].columns;
    return results[0].values.map(row => {
        const obj = {};
        cols.forEach((col, i) => obj[col] = row[i]);
        return toApi(obj);
    });
}

// Helper to get one flavour
function getFlavourById(id) {
    const stmt = db.prepare('SELECT * FROM flavours WHERE id = ?');
    stmt.bind([id]);
    if (!stmt.step()) { stmt.free(); return null; }
    const row = stmt.getAsObject();
    stmt.free();
    return row;
}

// Map DB snake_case to JS camelCase
function toApi(row) {
    return {
        id: row.id,
        nameEn: row.name_en,
        nameLt: row.name_lt,
        descEn: row.desc_en,
        descLt: row.desc_lt,
        badgeEn: row.badge_en,
        badgeLt: row.badge_lt,
        accent: row.accent,
        image: row.image
    };
}

// ===========================
// Express app
// ===========================
const app = express();
app.use(express.json());

// Static files
app.use(express.static(__dirname, { index: 'index.html' }));
app.use('/uploads', express.static(UPLOAD_DIR));

// Admin route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// ===========================
// Auth middleware
// ===========================
function requireAuth(req, res, next) {
    const token = req.headers['x-admin-token'];
    if (!token || token !== sessionToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// Simple in-memory session token (refreshed on server restart)
let sessionToken = null;

// ===========================
// File upload
// ===========================
const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        if (!allowed.includes(ext)) {
            return cb(new Error('Invalid file type'));
        }
        cb(null, crypto.randomUUID() + ext);
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ===========================
// Public API
// ===========================
app.get('/api/flavours', (req, res) => {
    res.json(getAllFlavours());
});

// ===========================
// Auth API
// ===========================
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        sessionToken = crypto.randomUUID();
        res.json({ token: sessionToken });
    } else {
        res.status(401).json({ error: 'Incorrect password' });
    }
});

// ===========================
// Admin CRUD API
// ===========================
app.post('/api/flavours', requireAuth, upload.single('image'), (req, res) => {
    const { nameEn, nameLt, descEn, descLt, badgeEn, badgeLt, accent } = req.body;
    const image = req.file ? 'uploads/' + req.file.filename : (req.body.existingImage || '');

    db.run(`
        INSERT INTO flavours (name_en, name_lt, desc_en, desc_lt, badge_en, badge_lt, accent, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [nameEn || '', nameLt || '', descEn || '', descLt || '', badgeEn || '', badgeLt || '', accent || '#e8a87c', image]);

    saveDb();

    // Get last inserted row
    const lastId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    const row = getFlavourById(lastId);
    res.status(201).json(toApi(row));
});

app.put('/api/flavours/:id', requireAuth, upload.single('image'), (req, res) => {
    const id = parseInt(req.params.id, 10);
    const existing = getFlavourById(id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { nameEn, nameLt, descEn, descLt, badgeEn, badgeLt, accent, removeImage } = req.body;

    let image = existing.image;
    if (req.file) {
        if (existing.image && existing.image.startsWith('uploads/')) {
            const oldPath = path.join(__dirname, existing.image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        image = 'uploads/' + req.file.filename;
    } else if (removeImage === 'true') {
        if (existing.image && existing.image.startsWith('uploads/')) {
            const oldPath = path.join(__dirname, existing.image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        image = '';
    }

    db.run(`
        UPDATE flavours SET name_en=?, name_lt=?, desc_en=?, desc_lt=?, badge_en=?, badge_lt=?, accent=?, image=?
        WHERE id=?
    `, [nameEn || '', nameLt || '', descEn || '', descLt || '', badgeEn || '', badgeLt || '', accent || '#e8a87c', image, id]);

    saveDb();

    const row = getFlavourById(id);
    res.json(toApi(row));
});

app.delete('/api/flavours/:id', requireAuth, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const existing = getFlavourById(id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    if (existing.image && existing.image.startsWith('uploads/')) {
        const filePath = path.join(__dirname, existing.image);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    db.run('DELETE FROM flavours WHERE id = ?', [id]);
    saveDb();
    res.json({ ok: true });
});

// ===========================
// Start
// ===========================
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Kana Kombucha server running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
