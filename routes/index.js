var express = require('express');
var router = express.Router();

// const database = require('../databaseMySQLCallbacks');
const database = require('../databaseMySQLPromises');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.post('/', (req, res, next) => {
    database.setupDatabase(req.body.host, req.body.user, req.body.password)
        .then(value => res.render('index', {databaseCreated: true}))
        .catch(reason => next(reason));
});

router.get('/fs_table', function (req, res, next) {
    database.read("foodstuffs")
        .then(value => res.render('foodstuffs_table', {items: value}))
        .catch(reason => next(reason));
});

router.get('/orders_table', function (req, res, next) {
    database.read("orders")
        .then(value => res.render('orders_table', {items: value}))
        .catch(reason => next(reason));
});

module.exports = router;
