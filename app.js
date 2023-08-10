/**
 * Module dependencies.
 */
let express, http,fileUpload,cookieParser,session,
    mongoose, bodyParser, methodOverride,
    app, route, d, config, url,flash,path;

let home_controller;

express = require('express');
http = require('http');
url = require('url');
path = require('path');
session = require('express-session');
flash = require('connect-flash');
fileUpload = require('express-fileupload');
mongoose = require('mongoose');
bodyParser = require('body-parser');
methodOverride = require('method-override');
cookieParser = require('cookie-parser');

home_controller = require('./controllers/HomeController');

app = express();
route = require('./route.js');
config = require('./config/index')();
d = new Date();

// all environments
// app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: "OzhclfxGp956SMjtq",
    resave: true,
    saveUninitialized: true,
}));
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
// use connect-flash for flash messages stored in session
app.use(flash());
app.use(fileUpload());

let mongoDB = "mongodb://" + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbname;
mongoose.connect(mongoDB, {useNewUrlParser: true},
    function (err, db) {
    if (err) {
        console.log(mongoDB);
        console.log('[' + d.toLocaleString() + '] ' + 'Sorry, there is no mongo db server running.');
    } else {
        let attachDB = function (req, res, next) {
            req.db = db;
            next();
        };
        app.use('/', attachDB, route);
        http.createServer(app).listen(config.port, function () {
            console.log('[' + d.toLocaleString() + '] ' + 'Express server listening on port ' + config.port);
        });
    }
});
