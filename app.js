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

app.post('/login', (req, res) => {
    console.log({ requestFromOutside: req.body })
    // const username = req.body.username
    // if (username === usernameFromDbExist){
    //     res.status(400).send("username already exists")
    // }
    res.send('Login succesful')
});

app.post('/login', (req, res) => {
    res.json(req.body);
});

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

app.get('/admin/data/:id', (req, res) => {
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

app.post('/admin/data/:id', (req, res) => {
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

app.delete('/admin/data/:id', (req, res) => {
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