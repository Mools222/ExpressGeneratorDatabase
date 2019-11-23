var express = require('express');
var router = express.Router();

// const database = require('../databaseMySQLCallbacks');
// const database = require('../databaseMySQLPromises');
const database = require('../databaseSequelize');

// Get all foodstuffs
// router.get('/', function (req, res, next) {
//     database.read("foodstuffs")
//         .then(value => res.send(value))
//         .catch(reason => next(reason));
// });

// // Get specific foodstuff
// router.get('/:id', function (req, res, next) {
//     database.read("foodstuffs", req.params.id)
//         .then(value => res.send(value))
//         .catch(reason => next(reason));
// });

// Get all foodstuffs + Get specific foodstuff
router.get('/:id?', function (req, res, next) { // "?" means the parameter is optional
    database.read("foodstuffs", (req.params.id ? req.params.id : null))
        .then(value => res.send(value))
        .catch(reason => next(reason));
});

// Create foodstuffs
router.post('/', (req, res, next) => {
    console.log(req.body);

    database.create(req.body.name, req.body.price)
        .then(value => res.redirect("/api/foodstuffs/" + value))
        .catch(reason => next(reason));
});

// Update foodstuff
router.put('/:id', (req, res, next) => {
    console.log(req.body);

    database.update(req.params.id, req.body.name, req.body.price)
        .then(value => res.redirect("/api/foodstuffs/" + req.params.id))
        .catch(reason => next(reason));
});

// Delete foodstuff
router.delete('/:id', (req, res, next) => {
    database.deleteSomething(req.params.id)
        .then(value => res.send(`Foodstuff ID ${req.params.id} has been deleted!`))
        .catch(reason => next(reason));
});

module.exports = router;
