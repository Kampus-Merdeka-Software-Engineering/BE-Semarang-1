const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

// Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use(bodyParser.json());

//Views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index', { text: 'Test'})
})

app.get('/admin/data', (req, res) => {
    res.render('admin/data', { text: 'admin'})
})

app.get('/login', (req, res) => {
    res.render('admin/login', { text: 'login'})
})

app.post('/', (req, res) => {
    res.json(req.body);
  });

app.post('/submit-form', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    const submitForm = JSON.stringify(req.body, null, 2);
    res.end(submitForm);
});

//Port
app.listen(port, () => console.info(`Running on port ${port}`))