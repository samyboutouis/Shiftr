var express = require('express')
var router = express.Router()
var saml2 = require('saml2-js');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var cookie = require('cookie');
const User = require('../models/user');

//configure identity provider
const idp_options = {
  sso_login_url: "https://shib.oit.duke.edu/idp/profile/SAML2/Unsolicited/SSO?providerId=https://shiftr.colab.duke.edu",
  sso_logout_url: "https://oauth.oit.duke.edu/oidc/logout.jsp",
  certificates: [fs.readFileSync("saml/idp_cert.crt").toString()]
};
const idp = new saml2.IdentityProvider(idp_options);


// Create service provider
const sp_options = {
  entity_id: "https://shiftr.colab.duke.edu",
  private_key: fs.readFileSync("saml/privateKey.key").toString(),
  certificate: fs.readFileSync("saml/certificate.crt").toString(),
  assert_endpoint: "http://localhost:8000/saml/consume"
};
const sp = new saml2.ServiceProvider(sp_options);

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

router.get('/attributes', (req,res) => {
  let token = req.cookies["shiftr-saml"];
  let decoded = jwt.verify(token, "make-a-real-secret");
  res.json(decoded);
});

//consume SAML respone from the DUKE IDP
router.post('/consume', (req, res) => {
  const options = {request_body: req.body};
  sp.post_assert(idp, options, function(err, saml_response) {
    if (err != null) {
      console.log(err)
      return res.sendStatus(500);
    }
  
    var attributes = mapAttrs(saml_response.user.attributes);

    // get role and groups
    let permissions = User.getPermissions(attributes.netid);
    permissions.then(result => { 

      // add role and groups to attributes
      attributes.role = result.role;
      attributes.group = result.group;

      const token = jwt.sign(attributes, "make-a-real-secret");

      // Set a new secure cookie for future auth
      res.cookie("shiftr-saml", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      })
      
      User.createIfAbsent(attributes);

      res.redirect('http://localhost:3000/saml/consume');
    });
  });
});

router.get('/logout', (req,res) => {
  res.clearCookie("shiftr-saml");
  res.redirect('https://shib.oit.duke.edu/cgi-bin/logout.pl');
});

mapAttrs = (attrs) => {
  return {
    "netid": attrs['urn:oid:0.9.2342.19200300.100.1.1'][0],
    "affiliaton": attrs['urn:oid:1.3.6.1.4.1.5923.1.1.1.5'],
    "mail": attrs['urn:oid:0.9.2342.19200300.100.1.3'][0],
    "eppa": attrs['urn:oid:1.3.6.1.4.1.5923.1.1.1.9'][0],
    "display_name": attrs['urn:oid:2.16.840.1.113730.3.1.241'][0],
    "eppn": attrs['urn:oid:1.3.6.1.4.1.5923.1.1.1.6'][0],
    "duid": attrs['urn:mace:duke.edu:idms:unique-id'][0]
  }     
}

module.exports = router