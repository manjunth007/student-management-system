const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new student
router.post('/signup', async (req, res) => {
    const { name, email, course, password } = req.body;

    // --- Basic Validation ---
    if (!name || !email || !course || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    // Password length validation
    if (password.length < 8) {
        return res.status(400).json({ msg: 'Password must be at least 8 characters.' });
    }
    // Email format validation
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
        return res.status(400).json({ msg: 'Please provide a valid email address' });
    }

    try {
        // Check if user already exists
        const [userExists] = await db.query('SELECT email FROM students WHERE email = ?', [email]);

        if (userExists.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert student into the database
        const [result] = await db.query(
            'INSERT INTO students (name, email, course, password) VALUES (?, ?, ?, ?)',
            [name, email, course, hashedPassword]
        );
        
        const studentId = result.insertId;

        // Create a corresponding entry in the marks table
        await db.query('INSERT INTO marks (student_id) VALUES (?)', [studentId]);

        res.status(201).json({
            msg: 'Student registered successfully. Please proceed to enter your marks.',
            studentId: studentId
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// We will add the /signin route here later

module.exports = router;
