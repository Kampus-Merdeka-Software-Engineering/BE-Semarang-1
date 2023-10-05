
const jwt = require('jsonwebtoken');

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