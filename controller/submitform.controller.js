const dbConnection = require('../db/db')

function submitForm(req, res) {
    const query = `INSERT INTO datas(name, email, message, review)
    VALUES (?, ?, ?, ?)`;
    const values = [req.body.name, req.body.email, req.body.message, "Unreviewed"];
    dbConnection.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error fetching data from database' });
        } else {
            res.status(201).json(results);
        }
    });
};

module.exports = { submitForm };