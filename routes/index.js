let express = require('express');
const getAssets = require("../packages/database/routes").getAssets;
let router = express.Router();

router.get('/assets', function (req, res, next) {
    getAssets(function (code, msg, ret) {
        console.log(code);
        if (code === 0) {
            console.log(ret);
            res.render('index', {title: 'All assets', description: ret});
        } else {
            res.render('index', {title: 'Error occurred', description: msg});
        }
    });
});

router.get('/', function (req, res, next) {
    getAssets(function (code, msg, ret) {
        console.log(code);
        if (code === 0) {
            console.log(ret);
            res.render('index', {title: 'All assets', description: ret});
        } else {
            res.render('index', {title: 'Error occurred', description: msg});
        }
    });
});

router.get('/chart', function (req, res, next) {
    res.render('chart', {title: 'Chart', description: ''});
});

module.exports = router;
