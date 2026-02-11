require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Routes
app.use('/api/auth', authRoutes);
// We will add student and admin routes later

// Test DB Connection and start server
db.query('SELECT 1')
    .then(() => {
        console.log('Successfully connected to MySQL database.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to database:', err.stack);
    });
