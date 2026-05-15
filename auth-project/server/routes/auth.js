const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// ქმნის ბაზის ფაილს (database.sqlite)
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('❌ ბაზის შეცდომა:', err.message);
    else console.log('✅ ლოკალური ბაზა (SQLite) წარმატებით ჩაირთო!');
});

// მომხმარებლების ცხრილის შექმნა
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT
)`);

// --- რეგისტრაცია (Register) ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "პაროლები არ ემთხვევა!" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "პაროლი უნდა იყოს მინ. 6 სიმბოლო!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, 
        [username, email, hashedPassword], function(err) {
            if (err) {
                return res.status(400).json({ error: "ეს Email უკვე გამოყენებულია!" });
            }
            res.status(201).json({ message: "რეგისტრაცია წარმატებით დასრულდა!" });
        });
    } catch (err) {
        res.status(500).json({ error: "სერვერის შეცდომა" });
    }
});

// --- ავტორიზაცია (Login) ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "მომხმარებელი ვერ მოიძებნა!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "პაროლი არასწორია!" });
        }

        // JWT ტოკენის შექმნა
        const token = jwt.sign({ id: user.id }, 'MY_SUPER_SECRET_KEY', { expiresIn: '1h' });
        res.json({ message: "ავტორიზაცია წარმატებულია!", token });
    });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 სერვერი მუშაობს პორტზე: ${PORT}`);
});