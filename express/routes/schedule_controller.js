var express = require('express')
var router = express.Router()
var scheduler = require('../scheduler');
var jwt = require('jsonwebtoken');

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// DELETE OR MAKE SAFER. (ANNA USES FOR TESTING)
router.put('/set_data', (req, res) => {
  let shifts = scheduler.set_data();
  shifts.then(result => { res.json(result) });
})

// DELETE OR MAKE SAFER. (ANNA USES FOR TESTING)
router.put('/hours_test_shifts', (req, res) => {
  let shifts = scheduler.hoursTestShifts();
  shifts.then(result => { res.json(result) });
})
  
router.get('/all_matches/:group', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === "supervisor") {
    let shifts = scheduler.all_shifts(req.params.group);
    shifts.then(result => { res.json(result) });
  } else {
    res.sendStatus(403)
  }
})

router.put('/assign_shifts/:group/:start_date/:end_date', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === "supervisor") {
    let schedule = scheduler.assign_shifts(req.params.group, parseInt(req.params.start_date), parseInt(req.params.end_date));
    schedule.then(result => { res.json(result) });
  } else {
    res.sendStatus(403)
  }
})

// MAKE ADMIN ONLY OR DELETE (ANNA USES FOR TESTING)
router.delete('/delete_data', (req, res) => {
  let shifts = scheduler.delete_data();
  shifts.then(result => { res.json(result) });
})

// DELETE LATER: CHECK WITH RYLEIGH FIRST
router.get('/rank_users/:group', (req, res) => {
  let shifts = scheduler.rank_users(req.params.group);
  shifts.then(result => { res.json(result) });
})

router.put('/edit_shift/:_id', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === "supervisor") {
    let shifts = scheduler.edit_shift(req.params._id, req.body);
    shifts.then(result => { res.json(result) });
  } else {
    res.sendStatus(403)
  }
})

router.get('/:_id', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === "supervisor") {
    let shifts = scheduler.get_schedule(req.params._id);
    shifts.then(result => { res.json(result) });
  } else {
    res.sendStatus(403)
  }
})

router.put('/publish_schedule/:_id', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === "supervisor") {
    let shifts = scheduler.publish_schedule(req.params._id);
    shifts.then(result => { res.json(result) });
  } else {
    res.sendStatus(403)
  }
})

module.exports = router
