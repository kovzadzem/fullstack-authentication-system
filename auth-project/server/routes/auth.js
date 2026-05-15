const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// 1. რეგისტრაცია (POST /api/register)
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) 
        return res.status(400).json({ message: 'გთხოვთ შეავსოთ ყველა ველი.' });

    if (password !== confirmPassword) 
        return res.status(400).json({ message: 'პაროლები არ ემთხვევა.' });

    if (password.length < 6) 
        return res.status(400).json({ message: 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.' });

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'ეს ელ-ფოსტა უკვე რეგისტრირებულია.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'რეგისტრაცია წარმატებით დასრულდა!' });
    } catch (err) {
        res.status(500).json({ message: 'სერვერის შეცდომა.' });
    }
});

// 2. ავტორიზაცია (POST /api/login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'გთხოვთ შეავსოთ ყველა ველი.' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'არასწორი ელ-ფოსტა ან პაროლი.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'არასწორი ელ-ფოსტა ან პაროლი.' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'ავტორიზაცია წარმატებულია.' });
    } catch (err) {
        res.status(500).json({ message: 'სერვერის შეცდომა.' });
    }
});

// 3. დაცული პროფილი (GET /api/profile)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'მონაცემების წამოღება ვერ მოხერხდა.' });
    }
});

module.exports = router;