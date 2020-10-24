let express = require('express');
const getAssets = require("../packages/database/routes").getAssets;
let router = express.Router();

/* GET home page. */
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

module.exports = router;
