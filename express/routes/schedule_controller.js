var express = require('express')
var router = express.Router()
var scheduler = require('../scheduler');

router.use(function timeLog (req, res, next) {
    let token = req.cookies["shiftr-saml"]
    console.log('Token ', token)
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

  router.put('/set_data', (req, res) => {
    let shifts = scheduler.set_data();
    shifts.then(result => { res.json(result) });
  })

  router.put('/hours_test_shifts', (req, res) => {
    let shifts = scheduler.hoursTestShifts();
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

router.put('/assign_shifts/:group/:start_date/:end_date', (req, res) => {
    let schedule = scheduler.assign_shifts(req.params.group, parseInt(req.params.start_date), parseInt(req.params.end_date));
    schedule.then(result => { res.json(result) });
})

router.delete('/delete_data', (req, res) => {
  let shifts = scheduler.delete_data();
  shifts.then(result => { res.json(result) });
})

router.get('/rank_users/:group', (req, res) => {
  let shifts = scheduler.rank_users(req.params.group);
  shifts.then(result => { res.json(result) });
})

router.put('/edit_shift/:_id', (req, res) => {
  let shifts = scheduler.edit_shift(req.params._id, req.body);
  shifts.then(result => { res.json(result) });
})

module.exports = router
