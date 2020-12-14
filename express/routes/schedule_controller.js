var express = require('express')
var router = express.Router()
var scheduler = require('../scheduler');

router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
  })

router.get('/', (req, res) => {
    let shifts = scheduler.schedule();
    shifts.then(result => { res.json(result) });
  })

  router.get('/temp_shifts', (req, res) => {
    console.log('Getting Shifts')
    let shifts = scheduler.temp_shifts("Code+");
    shifts.then(result => { res.json(result) });
  })

  router.get('/temp_users', (req, res) => {
    console.log('Getting Users')
    let shifts = scheduler.temp_users();
    shifts.then(result => { res.json(result) });
  })
  
router.get('/all_matches/:group', (req, res) => {
    let shifts = scheduler.all_shifts(req.params.group);
    shifts.then(result => { res.json(result) });
})

router.put('/assign_shifts/:group', (req, res) => {
    let schedule = scheduler.assign_shifts(req.params.group);
    schedule.then(result => { res.json(result) });
})

module.exports = router
