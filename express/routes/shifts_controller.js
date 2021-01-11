var express = require('express')
var router = express.Router()
const Shift = require('../models/shift');
var jwt = require('jsonwebtoken');

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// OLD CODE. NOT USED, BUT FRONTEND STILL EXISTS. DELETE OR MAKE SAFER.
router.get('/', (req, res) => {
  console.log('Getting Shifts')
  let shifts = Shift.all()
  shifts.then(result => { res.json(result) });
});

// MAKE THIS FIND BY GROUP AS WELL
router.get('/find_open/:status', (req, res) => {
  let shift = Shift.findByKeyValue("status" , req.params.status);
  shift.then(result => { res.json(result) });
});

// ADD NETID/SUPERVISOR/GROUP CONTROLS
router.get('/find_time/:start_time/:end_time', (req, res) => {
  let shift = Shift.findByHour(req.params.start_time, req.params.end_time);
  shift.then(result => { res.json(result)
  });
})

// ADD NETID/SUPERVISOR/GROUP CONTROLS
router.get('/find_day/:start_time/:end_time', (req, res) => {
  let shift = Shift.findByTime(req.params.start_time, req.params.end_time);
  shift.then(result => { res.json(result)
  });
})

// FIX IN FRONTEND (SL616 HARD CODED) & DECIDE WHETHER TO KEEP OR MAKE SECURE
router.get('/find_by_user/:netId', (req, res) => {
  let shift = Shift.findByKeyValue("employee.netid", req.params.netId);
  shift.then(result => { res.json(result) });
});

router.get('/employee_hours/:date', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === "employee") {
    let shift = Shift.findEmployeeHours(attributes.netid, parseInt(req.params.date));
    shift.then(result => { res.json(result) });
  } else {
    res.sendStatus(403);
  }
});

router.get('/supervisor_hours/:date', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === "supervisor") {
    let shift = Shift.findSupervisorHours(attributes.group, parseInt(req.params.date));
    shift.then(result => { res.json(result) });
  } else {
    res.sendStatus(403);
  }
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
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === 'supervisor' || attributes.role === 'admin') {
    let shift = Shift.find(req.params._id);
    shift.then(shift => {
      let deleteShift = shift.delete();
      deleteShift.then(result => res.json(result))
    });
  } else {
    res.sendStatus(403);
  }
})

// MAKE SAFER?
router.post('/', (req, res) => {
  let token = req.cookies["shiftr-saml"];
  let attributes = jwt.verify(token, "make-a-real-secret");
  if(attributes.role === 'supervisor' || attributes.role === 'admin') {
    const body = req.body;
    let shift = new Shift(body);
    shift = shift.create();
    shift.then(result => { res.json(result) });
  } else {
    res.sendStatus(403);
  }
})

router.put('/update/:_id', (req, res) => {
  const body = req.body;
  let shift = Shift.find(req.params._id);
  shift.then(shift => {
    let updateShift = shift.update(body)
    updateShift.then(result => res.json(result))
  })
})

//CHECKBOX DEPENDENT VIEWS IN CALENDAR
// router.put('/check/:group/:boole', (req, res) => {
//   const body = req.body;
//   let shift = Shift.updateShowStatus(req.params.group, boole); //this is all shifts that have the group of the button
//   shift.then(shift => {
//     let updateShift = shift.update(body)
//     updateShift.then(result => res.json(result))
//   })
// })
module.exports = router
