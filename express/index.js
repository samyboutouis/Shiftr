const db = require("./database")

db.connect(() => {
  const express = require('express')
  const multer = require('multer');
  const upload = multer()
  const session = require('express-session');
  const cors = require('cors')

  http = require('http'); 
    
  const hostname = '0.0.0.0';  
  const port = 8080; // TODO change this in prod
  const app = express();

  app.use(session(
    {
      secret: 'ssshhhhh',
      saveUninitialized: true,
      resave: true
    })
  ); //initialize session

  app.use(cors()) //allow cors requests
  app.use(express.json()); //this line allows us to read JSON bodies in the request


  const bodyParser = require('body-parser');
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  // for parsing multipart/form-data
  app.use(upload.array()); 
  app.use(express.static('public'));

  //for httponly cookies
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());


  //////// CONTROLLERS ////////
  //bind the users controller
  const users = require('./routes/users_controller')
  app.use('/users', users)

  //bind the saml controller
  const saml = require('./routes/saml_controller')
  app.use('/saml', saml)

  const shifts = require('./routes/shifts_controller')
  app.use('/shifts', shifts)

  const schedule = require('./routes/schedule_controller')
  app.use('/schedule', schedule)

  const app_server = http.createServer(app); 
    
  app_server.listen(port, hostname, () => { 
    console.log(`Server running at http://${hostname}:${port}/`); 
  });

});

 