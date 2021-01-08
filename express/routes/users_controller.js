var express = require('express')
var router = express.Router()
const User = require('../models/user')
var jwt = require('jsonwebtoken');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  let token = req.cookies["shiftr-saml"]
  console.log('Time: ', Date.now())
  next()
})

// TODO, write out logic to check auth, only call this when needed
// router.use(function checkAuth (req, res, next) {
//   console.log('Authenticating User')
//   res.json({"error": true})
// })

//all users
router.get('/', (req, res) => {
  console.log('Getting Users')
  let users = User.all()
  users.then(result => { res.json(result) });
})

// list of admins, employees, and other supervisors
router.get('/employee_list', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  let users = User.employeeList(attributes.group, attributes.netid)
  users.then(result => { res.json(result) });
})

//find 1 user
router.get('/find_one/:_id', (req, res) => {
  let user = User.find(req.params._id);
  user.then(result => { res.json(result) });
})

//find user by email
router.get('/find_email/:email', (req, res) => {
  let user = User.findByEmail(req.params.email);
  user.then(res.send(true)).catch(err => {res.send(false)});
});

//delete one user
router.delete('/delete/:_id', (req, res) => {
  let user = User.find(req.params._id);
  user.then(user => {
    let deleteUser = user.delete();
    deleteUser.then(result => res.json(result))
  }); 
})

//create user
router.post('/', (req, res) => {
  console.log("POST")
  const body = req.body;
  console.log("BODY")
  console.log(body)
  let user = new User(body);
  user = user.create();
  user.then(result => { res.json(result) });
})

//update user
router.put('/update/:_id', (req, res) => {
  const body = req.body;
  let user = User.find(req.params._id);
  user.then(user => {
    let updateUser = user.update(body)
    updateUser.then(result => res.json(result))
  })
})
//update user availability
router.put('/add_availability/:_id', (req, res) => {
  const body = req.body;
  let user = User.add_availability(req.params._id, body);
  user.then(result => res.json(result))
 })

module.exports = router