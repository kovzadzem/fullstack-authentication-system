const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ეს როუტი პირდაპირ გაატარებს რეგისტრაციას ბაზის გარეშე
app.post('/api/register', (req, res) => {
    console.log('მონაცემები შემოვიდა:', req.body);
    return res.status(201).json({ message: 'რეგისტრაცია წარმატებით დასრულდა! (ტესტ რეჟიმი)' });
});

app.post('/api/login', (req, res) => {
    return res.status(200).json({ token: 'fake-token-123', message: 'ავტორიზაცია წარმატებულია.' });
});

const PORT = 5001;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 სერვერი მუშაობს მისამართზე: http://127.0.0.1:${PORT}`);
});