let express = require('express');
const absorberService = require("../packages/absorber").absorberService;
let router = express.Router();

/* GET home page. */
router.get('/packages/database', function(req, res, next) {
  res.render('index', { title: 'Route' });
});

absorberService();

module.exports = router;
