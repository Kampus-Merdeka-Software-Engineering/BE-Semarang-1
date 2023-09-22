const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql');

const dbConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'ideku',
  });

dbConnection.connect((err) => {
if (err) {
    console.error('Database connection error:', err);
} else {
    console.log('Database connected successfully');
}
});

app.get('/admin/data', (req, res) => {
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

// app.get('/admin/data', (req, res) => {
//     res.render('admin/data', { text: 'admin'})
// })

app.get('/login', (req, res) => {
    res.render('admin/login', { text: 'login'})
})

app.post('/', (req, res) => {
    res.json(req.body);
  });

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
    // const submitForm = JSON.stringify(req.body, null, 2);
    // res.end(submitForm);
});

//Port
app.listen(port, () => console.info(`Running on port ${port}`))