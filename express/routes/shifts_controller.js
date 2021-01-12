var express = require('express')
var router = express.Router()
const Shift = require('../models/shift');
var jwt = require('jsonwebtoken');

router.use(function timeLog (req, res, next) {
  let token = req.cookies["shiftr-saml"]
  console.log('Time: ', Date.now())
  next()
})

router.get('/', (req, res) => {
  console.log('Getting Shifts')
  let shifts = Shift.all()
  shifts.then(result => { res.json(result) });
});

router.get('/find_one/:_id', (req, res) => {
  let shift = Shift.find(req.params._id);
  shift.then(result => { res.json(result) });
});

router.get('/find_open/:status', (req, res) => {
  let shift = Shift.findByKeyValue("status" , req.params.status);
  shift.then(result => { res.json(result) });
});

router.get('/find_time/:start_time/:end_time', (req, res) => {
  let shift = Shift.findByHour(req.params.start_time, req.params.end_time);
  shift.then(result => { res.json(result)
  });
})

router.get('/find_day/:start_time/:end_time', (req, res) => {
  let shift = Shift.findByTime(req.params.start_time, req.params.end_time);
  shift.then(result => { res.json(result)
  });
})

router.get('/find_by_user/:netId', (req, res) => {
  let shift = Shift.findByKeyValue("employee.netid", req.params.netId);
  shift.then(result => { res.json(result) });
});

router.get('/employee_hours/:date', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  let shift = Shift.findEmployeeHours(attributes.netid, parseInt(req.params.date));
  shift.then(result => { res.json(result) });
});

router.get('/supervisor_hours/:date', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  let shift = Shift.findSupervisorHours(attributes.group, parseInt(req.params.date));
  // TO TEST, COMMENT LINES ABOVE, UNCOMMENT LINE BELOW, AND CHANGE AFFILIATION (INSPECT > APPLICATION) FROM STUDENT
  // let shift = Shift.findSupervisorHours("da129", parseInt(req.params.date));
  shift.then(result => { res.json(result) });
});

router.get('/supervisor_schedule/:start/:end', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  let shift = Shift.findSupervisorHours(attributes.netid, parseInt(req.params.date));
  // TO TEST, COMMENT LINES ABOVE, UNCOMMENT LINE BELOW, AND CHANGE AFFILIATION (INSPECT > APPLICATION) FROM STUDENT
  // let shift = Shift.supervisorSchedule("da129", parseInt(req.params.start), parseInt(req.params.end));
  shift.then(result => { res.json(result) });
});

router.get('/find_by_time_and_user/:start_time/:end_time', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  let shift = Shift.findByTimeAndUser(attributes.netid, req.params.start_time, req.params.end_time);
  shift.then(result => { res.json(result)});
});

router.get('/find_conflict/:start_time/:end_time', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  let shift = Shift.findConflict(attributes.netid, req.params.start_time, req.params.end_time);
  shift.then(result => { res.json(result)});
});

router.delete('/delete/:_id', (req, res) => {
  let shift = Shift.find(req.params._id);
  shift.then(shift => {
    let deleteShift = shift.delete();
    deleteShift.then(result => res.json(result))
  });
})

router.post('/', (req, res) => {
  const body = req.body;
  let shift = new Shift(body);
  shift = shift.create();
  shift.then(result => {res.json(result)});
})

router.post('/open_shifts', (req, res) => {
  let shift = Shift.findByStatusAndGroup(req.body.status, req.body.groups);
  shift.then(result => {res.json(result)});
});

router.put('/update/:_id', (req, res) => {
  const body = req.body;
  let shift = Shift.find(req.params._id);
  shift.then(shift => {
    let updateShift = shift.update(body)
    updateShift.then(result => res.json(result))
  })
})

module.exports = router
