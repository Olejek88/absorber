require('dotenv').config();
let createError = require('http-errors');
const http = require('http');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let models = require('express-cassandra');
let logger = require('morgan');

let indexRouter = require('./routes/index');
const absorberService = require("./packages/absorber").absorberService;
const runDashboard = require("./packages/dashboard/wrapper").runDashboard;

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//app.set('view engine', 'jade');
//app.use(express.bodyParser());
//app.use(express.methodOverride());
app.use(require('stylus').middleware({
    src: __dirname + '/public'
}));
//app.use(app.router);
//return app.use(express["static"](__dirname + '/public'));


//Tell express-cassandra to use the models-directory, and
//use bind() to load the models using cassandra configurations.
models.setDirectory(__dirname + '/packages/database/models').bind(
    {
        clientOptions: {
            contactPoints: ['127.0.0.1'],
            localDataCenter: 'dc1',
            protocolOptions: {port: 9042},
            keyspace: 'crypto',
            queryOptions: {consistency: models.consistencies.one}
        },
        ormOptions: {
            defaultReplicationStrategy: {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe'
        }
    },
    function (err) {
        if (err) throw err;
    }
);

absorberService();

//let http_server;
let options = {};
//const server = http.createServer(app);
let server = require('http').createServer(options, function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*:*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS' || req.method === 'GET') {
        res.writeHead(200);
        res.end();
        return;
    }
});
http_server = server.listen(10927);
let io = require('socket.io')(http_server);
//let io = require('socket.io')(http_server, { origins: '*:*'});
//io.set('origins','*:*');
//io.origins('*:*');

console.log("express server listening on port %d", 10927);
runDashboard(io);

module.exports = app;
