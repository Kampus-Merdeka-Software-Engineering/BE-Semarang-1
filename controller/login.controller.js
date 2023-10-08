const dbConnection = require('../db/db');
const { generateToken } = require('../auth/jwt');

function postLogin(req, res) {
  
  const username = req.body.usernameLogin;
  const email = req.body.emailLogin;
  const password = req.body.passwordLogin;

    const query = `SELECT * FROM admins WHERE username = ? AND email = ? AND password = ?`;
    
    dbConnection.query(query, [username, email, password], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          res.status(500).json({ success: false, message: 'Login error' });
        } else {
          if (results.length > 0) {
            const user = results[0];
            const token = generateToken(user);
            res.status(200).json({ success: true, token: token, username: username });
          } else {
            res.status(403).json({ success: false, message: 'Login failed' });
          }
        }
    });
}

module.exports = { postLogin };

