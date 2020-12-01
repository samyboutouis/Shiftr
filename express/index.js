const db = require("./database")

db.connect(() => {
  const express = require('express')
  const multer = require('multer');
  const upload = multer()
  const cors = require('cors')

  http = require('http'); 
    
  const hostname = '0.0.0.0';  
  const port = 8080; // TODO change this in prod
  const app = express();
;
  
  app.use(cors()) //allow cors requests
  app.use(express.json()); //this line allows us to read JSON bodies in the request

  // for parsing multipart/form-data
  app.use(upload.array()); 
  app.use(express.static('public'));


  // const bodyParser = require('body-parser');
  // app.use(bodyParser.urlencoded({ extended: true }));
  // for parsing multipart/form-data
  // app.use(upload.array()); 
  // app.use(express.static('public'));
  

  //bind the users controller
  const users = require('./routes/users_controller')
  app.use('/users', users)


  const app_server = http.createServer(app); 
    
  app_server.listen(port, hostname, () => { 
    console.log(`Server running at http://${hostname}:${port}/`); 
  });

});

 