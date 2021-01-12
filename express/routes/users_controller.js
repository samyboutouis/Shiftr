var express = require('express')
var router = express.Router()
const User = require('../models/user')
var jwt = require('jsonwebtoken');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

//all users
// NOT CURRENTLY USED
router.get('/', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === 'admin') {
    console.log('Getting Users')
    let users = User.all()
    users.then(result => { res.json(result) });
  } else {
    res.sendStatus(403);
  }
})

// list of admins, employees, and other supervisors
router.get('/employee_list', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === 'supervisor') {
    let users = User.employeeList(attributes.group, attributes.netid)
    users.then(result => { res.json(result) });
  } else {
    res.sendStatus(403);
  }
})

//find 1 user
// NOT CURRENTLY USED. DELETE OR MAKE SAFER WITH NETID/ROLE VERIFICATION
router.get('/find_one/:_id', (req, res) => {
  let user = User.find(req.params._id);
  user.then(result => { res.json(result) });
})

//delete one user
// NOT CURRENTLY USED. MAKE SAFER
router.delete('/delete/:_id', (req, res) => {
  let user = User.find(req.params._id);
  user.then(user => {
    let deleteUser = user.delete();
    deleteUser.then(result => res.json(result))
  }); 
})

//create user
router.post('/', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === 'supervisor' || attributes.role === 'admin') {
    const body = req.body;
    let user = new User(body);
    user = user.create();
    user.then(result => { res.json(result) });
  } else {
    res.sendStatus(403);
  }
})

//update user
router.put('/update/:_id', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === 'supervisor' || attributes.role === 'admin') {
    const body = req.body;
    let user = User.find(req.params._id);
    user.then(user => {
      let updateUser = user.update(body)
      updateUser.then(result => res.json(result))
    })
  } else {
    res.sendStatus(403);
  }
})

//update user availability
// ADD NETID VERIFICATION & MAYBE ROLES
router.put('/add_availability', (req, res) => {
  const body = req.body;
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  let user = User.add_availability(attributes.netid, body);
  user.then(result => res.json(result))
 })

 router.get('/get_availability', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  let user = User.get_availability(attributes.netid);
  user.then(result => res.json(result))
 })

module.exports = router