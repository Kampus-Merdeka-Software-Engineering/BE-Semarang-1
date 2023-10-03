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

app.use(cors())

dbConnection.connect((err) => {
if (err) {
    console.error('Database connection error:', err);
} else {
    console.log('Database connected successfully');
}
});

// Secret key to assign JWT
const secretKey = 'justideku';
// Generate token
function generateToken(user) {
    const payload = {
      username: user.username,
      email: user.email
    }; 
    // Expiration 1 hour
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}
// Verif token
function verifyToken(token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      return null; // If token invalid or expired
    }
  }
  
module.exports = {
    generateToken,
    verifyToken,
};

function authenticateToken(req, res, next) {
    const token = req.headers['Authorization']; // Send token in header "Authorization"
    const tokenCookie = req.headers.cookie.split("token=")[1]
    if (!token) {
        if (!tokenCookie){
            return res.status(401).json({ message: 'Token not provided' });
        } 
    }
    // Verif token
    let decoded 
    if (!token){
        decoded = verifyToken(tokenCookie)
    } else {
        decoded = verifyToken(token);
    }
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; // Save user authenticated at object req
    next();
}

// Submit Form Contact us
app.post('/api/submit-form', submitForm);

// Submit Page Login
app.post('/api/login', postLogin);

// Admin Data
app.get('/api/admin/data', getAdminData);
app.get('/api/admin/data/:id', authenticateToken, getIdAdminData);
app.post('/api/admin/data/:id', authenticateToken, postIdAdminData);
app.delete('/api/admin/data/:id', authenticateToken, deleteIdAdminData);

//Port
app.listen(port, () => console.info(`Running on port ${port}`))
