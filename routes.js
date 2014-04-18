var request = require('request');
var sf = require('node-salesforce');
var creds = require('./config/credentials.js');  // Used to stor API keys etc
var queries = require('./lib/queries.js');    // Used to build query strings

var conn = new sf.Connection({
  loginUrl: creds.url
});

module.exports = {

  login: function(req, res) {
    conn.login(creds.username, creds.password, function(err, userInfo) {
      if (err) {
        res.send("Connection error: " + err);
      }
      res.send(req.user);
    });
  },

  authfail: function(req, res) {
    res.send('Authentication Failed', 401);
  },
  
  listAccounts: function(req, res) {
    conn.query(queries.listAccounts(), function(err, result) {
      if(err) res.send(err);
      if(result && result.totalSize > 0) {
        res.send(result.records);
      }
      else {
        res.send(500);
      }
    });  
  },

  listCases: function(req, res) {
    conn.query(queries.listCases(), function(err, result) {
      if (err) res.send(err);
      if(result && result.totalSize > 0) {
        var sorted = [];
        for(var i = 0; i !== result.totalSize; i++) {
          if(!result.records[i].IsClosed) {
            sorted.unshift(result.records[i]);
          }
          else {
            sorted.push(result.records[i]);
          }
        }
        res.send(sorted);
      }
      else {
        res.send(500);
      }
    });
  },

  listOpps: function(req, res) {
    conn.query(queries.listOpps(), function(err, result) {
      if (err) res.send(err);
      if(result && result.totalSize > 0) {
        res.send(result.records);
      }
      else {
        res.send(500);
      }
    });
  },

  listCampaigns: function(req, res) {
    conn.query(queries.listCampaigns(), function(err, result) {
      if (err) res.send(err);
      if(result && result.totalSize > 0) {
        res.send(result.records);
      }
      else {
        res.send(500);
      }
    });
  }, 

  accountDetails: function(req, res) {
    conn.sobject('Account').retrieve(req.params.accountId, function(err, account) {
      if (err) res.send(err);
      console.log(account)
      injectLatLong(account, function(err, data) {
        if(err) res.send(err);
        res.send(data);
      });
    });
  },

  caseDetails: function(req, res) {
    conn.sobject('Case').retrieve(req.params.caseId, function(err, caseDetails) {
      if (err) res.send(err);
      res.send(caseDetails);
    });
  }

}

// This function queries the Goole Maps API for the business' GPS coords, by using their address.
function injectLatLong(account, cb) {
  var url, body = '';
  var address = [
    account.BillingStreet,
    account.BillingCity,
    (account.BillingCountry || '')
  ].join(', ');
  address = address.replace(/ /g, '+');
  url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var location = (JSON.parse(body)).results[0].geometry.location;
      account.latlng = location.lat + ',' + location.lng;
      account.lat = parseFloat(location.lat);
      account.lng = parseFloat(location.lng);
      return cb(null, account);
    } else {
      return(error, null);
    }
  });
}