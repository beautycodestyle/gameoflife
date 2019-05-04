var express = require('express');
var router = express.Router();

/**
 *  GET oscillator of example.
 */
router.get('/example/oscillator', function(req, res, next) {
    res.render('example', {'type': 0});
});

/**
 *  GET another oscillator of example.
 */
router.get('/example/other-oscillator', function(req, res, next) {
    res.render('example', {'type': 2});
});

/**
 *  GET spaceship of example.
 */
router.get('/example/spaceship', function(req, res, next) {
    res.render('example', {'type': 1});
});

module.exports = router;
