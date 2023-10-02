const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const dbConnection = mysql.createConnection({
    host: 'containers-us-west-191.railway.app',
    user: 'root',
    password: 'afYPKtqEsb1Xnm6JsHbT',
    database: 'railway',
    port: 7030,
    
  });

dbConnection.connect((err) => {
if (err) {
    console.error('Database connection error:', err);
} else {
    console.log('Database connected successfully');
}
});

module.exports = dbConnection;


// Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index', { text: 'Test'})
})

app.get('/login', (req, res) => {
    res.render('admin/login', { text: 'login'})
})

app.post('/submit-form', (req, res) => {
    const query = `INSERT INTO datas(name, email, message, review)
    VALUES (?)`;
    const value = [req.body.name, req.body.email, req.body.message, "Unreviewed"];
    dbConnection.query(query, [value], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error fetching data from database' });
        } else {
            res.redirect("/");
        }
    });
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

app.post('/login', (req, res) => {
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
            // Login success, generate token
            const user = results[0];
            const token = generateToken(user);
    
            // Respons as json
            res.json({ success: true, token: token });
          } else {
            res.json({ success: false, message: 'Login failed' });
          }
        }
    });
});

app.get('/admin/data', authenticateToken, (req, res) => {
    const sqlQuery = 'SELECT * FROM datas';
    
    dbConnection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error fetching data from database' });
        } else {
            // res.json(results);
            res.render('admin/data', {messages: results})
        }
    });
});

app.get('/admin/data/:id', authenticateToken, (req, res) => {
    const postId = req.params.id;
    const sqlQuery = `SELECT * FROM datas WHERE data_id = ?`;

    dbConnection.query(sqlQuery, [postId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error fetching data from database' });
        } else {
            res.json(results);
            // res.render('admin/data/', {messages: results})
        }
    });
});

app.post('/admin/data/:id', authenticateToken, (req, res) => {
    const postId = req.params.id;
    const { name, email, message, review } = req.body;

    const sqlQuery = `UPDATE datas SET name=?, email=?, message=?, review=? WHERE datas.data_id=?`;
    const values = [name, email, message, review, postId];

    dbConnection.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error updating data in the database' });
        } else {
            // console.log('result:', results);
            // res.redirect("/admin/data");
            res.json(results);
        }
    });
});

app.delete('/admin/data/:id', authenticateToken, (req, res) => {
    const postId = req.params.id;

    const sqlQuery = `DELETE from datas WHERE datas.data_id=?`;
    const values = [postId];

    dbConnection.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error deleting data in the database' });
        } else {
            res.json(results);
        }
    });
});

//Port
app.listen(port, () => console.info(`Running on port ${port}`))
