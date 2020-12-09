var express = require('express')
var router = express.Router()
const request = require('sync-request');
const jwt_decode  = require("jwt-decode");
const session = require('express-session');
const ldap = require('ldapjs');
let client = ldap.createClient({
  url: 'ldap://ldap.duke.edu:389'
});

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.get('/consume', (req, res) => {
  const code = req.query.code;
  const token = getToken(code);
  const idToken = parseIdToken(token);// TODO so, what are you going to do now? IMPORTANT: idToken and the "actual" token are not the same
  res.json({"access_token": JSON.parse(token).access_token, "id_token": idToken});
  // res = request("POST", encodeURI(process.env.OAUTH_REDIRECT_URI), {"access_token": JSON.parse(token).access_token, "id_token": idToken});
})

//ldap query for user info
router.post('/ldap', (req, res) => {
  const netid = req.body.netid;
  //const name;
  var opts = {
    filter: '(uid='+netid+')'
  };
  client.search("dc=duke,dc=edu", opts, (err, res) => {
    res.on('searchEntry', entry => {
      console.log('entry: ' + JSON.stringify(entry.object));
    });
    res.on('searchReference', referral => {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', err => {
      console.error('error');
    });
    res.on('end', result => {
      console.log('status: ' + result.status);
    });
  });
  res.json({"name": netid});
});

//helpers
format_auth_string = () => {
  const auth_string = `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`
  return Buffer.from(auth_string).toString('base64')
}
  
getToken = (code) => {
  const url = "https://oauth.oit.duke.edu/oidc/token"
  const auth = format_auth_string();
  const redirect_uri = encodeURI(process.env.OAUTH_REDIRECT_URI)

  console.log("SNTHSNTHSNTHSNTH")
  console.log(redirect_uri)



  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: `grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${code}` 
    
  };

  const res = request("POST", url, options) 
  console.log(res);
  let body =  Buffer.from(res.getBody());
  body = body.toString()
  console.log('body');
  console.log(body);

  return body;
}

parseIdToken = (token) => {
  let idToken = JSON.parse(token).id_token;
  idToken = jwt_decode(idToken);
  return (idToken)
}

module.exports = router