var mbaas = require('fh-mbaas-express');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var cors = require('cors');
var path = require('path');
var jwt = require('express-jwt');
var routes = require('./routes.js');
var creds = require('./config/credentials.js');

var app = express();

// Securable endpoints: list the endpoints which you want to make securable here
var securableEndpoints = ['hello'];

// JSON Web Token implementation for Auth0
var authenticate = jwt({
  secret: new Buffer(creds.secret, 'base64'),
  audience: creds.audience
});

//var corsOptions = {
//  origin: 'http://127.0.0.1:8000',
//  methods: ['GET, PUT, POST, DELETE, OPTIONS'],
//  allowedHeaders: ['Content-Type', 'Authorization']
//};


// Route definitions
app.get('/api/login', routes.login);
app.get('/api/accounts', routes.listAccounts);
app.get('/api/cases', routes.listCases);
app.get('/api/opps', routes.listOpps);
app.get('/api/campaigns', routes.listCampaigns);
app.get('/api/accounts/:accountId', routes.accountDetails);
app.get('/api/cases/:caseId', routes.caseDetails);

app.use(cors());
app.use(session({secret: 'shhhhhhhhh'}));
app.use(cookieParser);
app.use(express.static(path.join(__dirname, '/www')));

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaas.sys(securableEndpoints));
app.use('/mbaas', mbaas.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaas.fhmiddleware());

app.use('/api', authenticate);

// You can define custom URL handlers here, like this one:
app.use('/', function(req, res) {
  res.end('Your Cloud App is Running');
});

// Important that this is last!
app.use(mbaas.errorHandler());

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001;
var server = app.listen(port, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});