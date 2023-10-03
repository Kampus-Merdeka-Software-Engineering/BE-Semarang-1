const dbConnection = require('../db/db')

function getAdminData(req, res) {
    const sqlQuery = 'SELECT * FROM datas';
    dbConnection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error fetching data from database' });
        } else {
            // res.render('admin/data', {messages: results})
            res.status(200).json({ success: true, messages: results })
        }
    });
};

function getIdAdminData(req, res) {
    const postId = req.params.id;
    const sqlQuery = `SELECT * FROM datas WHERE data_id = ?`;

    dbConnection.query(sqlQuery, [postId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error fetching data from database' });
        } else {
            res.status(200).json({ success: true, results });
        }
    });
};

function postIdAdminData(req, res) {
    const postId = req.params.id;
    const { name, email, message, review } = req.body;

    const sqlQuery = `UPDATE datas SET name=?, email=?, message=?, review=? WHERE datas.data_id=?`;
    const values = [name, email, message, review, postId];

    dbConnection.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error updating data in the database' });
        } else {
            res.status(200).json({ success: true, results });
        }
    });
};

function deleteIdAdminData(req, res) {
    const postId = req.params.id;

    const sqlQuery = `DELETE from datas WHERE datas.data_id=?`;
    const values = [postId];

    dbConnection.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Error deleting data in the database' });
        } else {
            res.status(200).json({ success: true, results });
        }
    });
};

module.exports = {
    getAdminData, 
    getIdAdminData, 
    postIdAdminData, 
    deleteIdAdminData
};