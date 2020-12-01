var express = require('express')
var router = express.Router()
const User = require('../models/user')


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
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

//find 1 user
router.get('/find_one/:name', (req, res) => {
  let user = User.find(req.params.name);
  user.then(result => { res.json(result) });
})


//delete one user
router.delete('/delete/:name', (req, res) => {
  let user = User.find(req.params.name);
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
router.put('/update/:name', (req, res) => {
  const body = req.body;
  let user = User.find(req.params.name);
  user.then(user => {
    let updateUser = user.update(body)
    updateUser.then(result => res.json(result))
  })
})

module.exports = router