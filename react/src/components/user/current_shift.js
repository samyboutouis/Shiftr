import React, {Component} from 'react';
import AllShiftsToday from '../shift/all_shifts_today';

class CurrentShift extends Component {
  constructor(props){
    super(props);
  }

  render() {
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
    let shift = []
    shift.push(
      <div key="greeting">
        <p className="greeting">Hello, {this.props.name}.</p>
        <p className="landing-box">{landing}</p>
      </div>
    );
    shift.push(<AllShiftsToday numOfShifts={this.props.shiftsToday} shifts={this.props.shifts} key="shifts"/>);
    return (
      <div className="background-pretty-gradient">
        {shift}
      </div>
    );
  }
}

export default CurrentShift;