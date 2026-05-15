// 1. საჭირო ბიბლიოთეკების (Modules) შემოტანა
const express = require('express');      // ვებ-ჩარჩო API ენდპოინტების შესაქმნელად
const sqlite3 = require('sqlite3').verbose(); // მონაცემთა ბაზასთან (SQLite) სამუშაოდ
const cors = require('cors');            // სხვადასხვა პორტიდან (Front-Back) კავშირის დასაშვებად
const bcrypt = require('bcrypt');        // პაროლების ჰეშირებისთვის (უსაფრთხოება)
const jwt = require('jsonwebtoken');     // ავტორიზაციის ტოკენების შესაქმნელად

const app = express();
app.use(cors());                         // CORS პოლიტიკის გააქტიურება
app.use(express.json());                 // სერვერს ვასწავლით JSON ფორმატის კითხვას

// 2. ლოკალური მონაცემთა ბაზის ფაილის (.sqlite) შექმნა და დაკავშირება
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(' ბაზის შეცდომა:', err.message);
    else console.log(' ლოკალური ბაზა (SQLite) მზად არის!');
});

// 3. ცხრილის (Table) შექმნა SQL ენაზე, თუ ის უკვე არ არსებობს
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE, -- UNIQUE ნიშნავს, რომ მეილი არ უნდა განმეორდეს
    password TEXT
)`);

// --- 4. რეგისტრაციის ენდპოინტი (POST /api/register) ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // ვალიდაცია: ვამოწმებთ შევსებულია თუ არა ველები და ემთხვევა თუ არა პაროლები
        if (!username || !email || !password) return res.status(400).json({ error: "შეავსეთ ყველა ველი!" });
        if (password !== confirmPassword) return res.status(400).json({ error: "პაროლები არ ემთხვევა!" });
        if (password.length < 6) return res.status(400).json({ error: "პაროლი უნდა იყოს მინ. 6 სიმბოლო!" });

        // პაროლის ჰეშირება: bcrypt აქცევს პაროლს გაუგებარ სტრინგად
        const hashedPassword = await bcrypt.hash(password, 10);

        // მონაცემების ჩაწერა ბაზაში (SQL INSERT)
        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, 
        [username, email, hashedPassword], (err) => {
            // თუ მეილი უკვე არსებობს, SQLite დააბრუნებს შეცდომას
            if (err) return res.status(400).json({ error: "ეს Email უკვე არსებობს!" });
            res.status(201).json({ message: "რეგისტრაცია წარმატებულია!" });
        });
    } catch (err) { res.status(500).json({ error: "სერვერის შეცდომა" }); }
});

// --- 5. ავტორიზაციის ენდპოინტი (POST /api/login) ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // ვეძებთ მომხმარებელს ბაზაში მეილის მიხედვით
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        // თუ მომხმარებელი არ არსებობს ან ბაზამ შეცდომა მოგვცა
        if (err || !user) return res.status(400).json({ error: "მომხმარებელი ვერ მოიძებნა!" });

        // bcrypt.compare ადარებს შეყვანილ პაროლს ბაზაში არსებულ ჰეშს
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "პაროლი არასწორია!" });

        // თუ ყველაფერი სწორია, ვქმნით JWT ტოკენს, რომელიც ძალაშია 1 საათი
        const token = jwt.sign({ id: user.id }, 'SECRET_KEY_123', { expiresIn: '1h' });
        
        // ვაბრუნებთ პასუხს და ტოკენს კლიენტთან
        res.json({ message: "შესვლა წარმატებულია!", token });
    });
});

// 6. სერვერის გაშვება მითითებულ პორტზე
app.listen(5001, () => console.log('🚀 სერვერი მუშაობს პორტზე 5001'));