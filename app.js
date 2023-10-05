const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dbConnection = require('./db/db');
const { getAdminData, getIdAdminData, postIdAdminData, deleteIdAdminData } = require('./controller/admin.controller');
const { submitForm } = require('./controller/submitform.controller');
const { postLogin } = require('./controller/login.controller');
const { verifyToken } = require('./auth/jwt');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

dbConnection.connect((err) => {
if (err) {
    console.error('Database connection error:', err);
} else {
    console.log('Database connected successfully');
}
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split("Bearer ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    // Verif token
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; // Menyimpan pengguna yang diotentikasi dalam objek req
    next();
}

// Submit Form Contact us
app.post('/api/submit-form', submitForm);

// Submit Page Login
app.post('/api/login', postLogin);

// Admin Data
app.get('/api/admin/data', authenticateToken, getAdminData);
app.get('/api/admin/data/:id', authenticateToken, getIdAdminData);
app.post('/api/admin/data/:id', authenticateToken, postIdAdminData);
app.delete('/api/admin/data/:id', authenticateToken, deleteIdAdminData);

//Port
app.listen(port, () => console.info(`Running on port ${port}`))
