import React, {Component} from 'react';
import axios from 'axios';
import format from 'date-fns/format'
import Clock from '../../clock.png';
import getUnixTime from 'date-fns/getUnixTime'

class CurrentShift extends Component {
  constructor(props){
    super(props);
    this.state = {clockedIn: false, clockedOut: false, shifts: []};
  }

  drawShifts = () => {
    let message = "";
    let shifts = [];
    if(this.props.shifts){
      shifts.push(this.mapShifts());
      if(localStorage.getItem('role')==='employee'){
        if(this.props.shifts[0].hasOwnProperty('clocked_in')){
          message = "Clock Out";
        } else {
          message = "Clock In";
        }
        shifts.push(
          <button className="clock-in" key="button" onClick={this.handleClick.bind(this, this.props.shifts[0])}> 
            <img className="clock" src={Clock} alt="Clock"/>
            <span className="clock-text">{message}</span>
          </button>
        );
      }
      return (
        <div>
          {shifts}
        </div>
      );
    }
  }

  mapShifts = () => {
    let shifts = this.props.shifts;
    let timeFormat = "hh:mm";
    let pm = "a";
    return shifts.map((shift,index) => {
      let person = "Open Shift";
      let location = <p className="shift-location">{shift.location} </p>;
      if(shift.hasOwnProperty("employee") && (localStorage.getItem('role')==='supervisor' || localStorage.getItem('role')==='admin')){
        let firstName = shift.employee.name.split(" ")[0];
        let lastName = shift.employee.name.split(" ")[1];
        person = firstName + " " + lastName.charAt(0) + ".";
        location = <p className="shift-location">{person} @ {shift.location} </p>;
      }
      return (
        <div key={index}>
          <div className="transparent-box">
            <div>
              <p className="shift-time">{format(shift.start_time * 1000, timeFormat)}<span className="pm">{format(shift.start_time * 1000, pm)}</span> &#8594; {format(shift.end_time * 1000, timeFormat)}<span className="pm">{format(shift.end_time * 1000, pm)}</span></p>
              {location}
              <p className="shift-role"> {shift.group} </p>
            </div>
          </div>
        </div>
      ); 
    });
  }

  handleClick = (shift) => {
    let time = getUnixTime(Date.now());
    if(time + 600 < shift.start_time && !shift.hasOwnProperty('clocked_in')){
      alert("It is too early to clock in to your shift! Please wait until 10 minutes before to clock in."); // 10 minutes before or earlier
    } else if(shift.hasOwnProperty('clocked_in') && window.confirm("Are you sure you want to clock out?")){
      axios.put("http://localhost:8080/shifts/update/" + this.props.shifts[0]._id, {clocked_out: time, status: "completed"}).then((response) => {
        this.props.getShifts();
      }).catch(function (err){  
        console.log(err)
      });
    } else if(window.confirm("Are you sure you want to clock in?")){
      axios.put("http://localhost:8080/shifts/update/" + this.props.shifts[0]._id, {clocked_in: time}).then((response) => {
        this.props.getShifts();
      }).catch(function (err){  
        console.log(err)
      });
    }
  }

  determineMessage = () => {
    let landing = "You have no shifts left today."
    if(localStorage.getItem('role')==='employee'){
      if(this.props.shiftsToday > 0){
        if(this.props.shiftsToday === 1){
          landing = "You have one shift today."
        } else{
          landing = "You have " + this.props.shiftsToday + " shifts today."
        }
      }
    }
    else if(localStorage.getItem('role')==='supervisor' || localStorage.getItem('role')==='admin'){
      if(this.props.shiftsToday === 0){
        landing = "No employees are scheduled to work today."
      } else {
        if(this.props.shiftsToday === 1){
          landing = "You have one employee working today."
        } else{
          landing = "You have " + this.props.shiftsToday + " employees working today."
        }
      }
    }
    return landing;
  }

  renderShift = () => {
    let zeroShifts = "Enjoy the time off!"
    if(this.props.shiftsToday === 0 || this.state.clockedOut){
      return (
        <div className="transparent-box" key="no-shift">
          <p className="no-shifts">{zeroShifts}</p>
        </div>
      );
    }
    else {
      return (
        <div key="shift">
          {this.drawShifts()}
        </div>
      );
    }
  }

  render() {
    let landing = this.determineMessage();
    let shift = []
    shift.push(
      <div key="greeting">
        <p className="greeting">Hello, {this.props.name}.</p>
        <p className="landing-box">{landing}</p>
      </div>
    );
    let currentShift = this.renderShift();
    shift.push(currentShift);
    return (
      <div className="background-pretty-gradient">
        {shift}
      </div>
    );
  }
}

export default CurrentShift;