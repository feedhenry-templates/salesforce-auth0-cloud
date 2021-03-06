// Main Start point into the app
var express = require('express');
var mbaasApi = require('fh-mbaas-api');
var mbaasExpress = mbaasApi.mbaasExpress();
var path = require('path');
var jwt = require('express-jwt');
var cors = require('cors');
var mainjs = require('./main.js');
var routes = require('./routes.js');
var creds = require('./config/credentials.js');

// JSON Web Token implementation for Auth0
var authenticate = jwt({
  secret: new Buffer(creds.secret, 'base64'),
  audience: creds.audience
});

var app = express();

var corsOptions = { 
  origin: 'http://127.0.0.1:8000',
  methods: ['GET, PUT, POST, DELETE, OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Use Express to parse various params and allow CORS for FHC local
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'shhhhhhhhh' }));
    app.use(express.methodOverride());
    app.use(cors(corsOptions));
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    // intercept all /api calls and validate the token
    app.use('/api', authenticate);
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '../client/default')));
});

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());
app.use('/cloud', mbaasExpress.cloud(mainjs));

// Route definitions
app.get('/api/login', routes.login);
app.get('/api/accounts', routes.listAccounts);
app.get('/api/cases', routes.listCases);
app.get('/api/opps', routes.listOpps);
app.get('/api/campaigns', routes.listCampaigns);
app.get('/api/accounts/:accountId', routes.accountDetails);
app.get('/api/cases/:caseId', routes.caseDetails);

app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var server = app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port); 
});
