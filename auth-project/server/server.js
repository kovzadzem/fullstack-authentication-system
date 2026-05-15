const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// ბაზის შექმნა
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('❌ ბაზის შეცდომა:', err.message);
    else console.log('✅ ლოკალური ბაზა (SQLite) მზად არის!');
});

// ცხრილის შექმნა
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT
)`);

// --- რეგისტრაცია ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password) return res.status(400).json({ error: "შეავსეთ ყველა ველი!" });
        if (password !== confirmPassword) return res.status(400).json({ error: "პაროლები არ ემთხვევა!" });
        if (password.length < 6) return res.status(400).json({ error: "პაროლი უნდა იყოს მინ. 6 სიმბოლო!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, 
        [username, email, hashedPassword], (err) => {
            if (err) return res.status(400).json({ error: "ეს Email უკვე არსებობს!" });
            res.status(201).json({ message: "რეგისტრაცია წარმატებულია!" });
        });
    } catch (err) { res.status(500).json({ error: "სერვერის შეცდომა" }); }
});

// --- ავტორიზაცია (Login) ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: "მომხმარებელი ვერ მოიძებნა!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "პაროლი არასწორია!" });

        const token = jwt.sign({ id: user.id }, 'SECRET_KEY_123', { expiresIn: '1h' });
        res.json({ message: "შესვლა წარმატებულია!", token });
    });
});

app.listen(5001, () => console.log('🚀 სერვერი მუშაობს პორტზე 5001'));