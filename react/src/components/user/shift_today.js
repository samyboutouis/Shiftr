import React, {Component} from 'react';
import axios from 'axios';
//import ShiftShow from '../shift/show'
import ShiftForm from '../shift/form'

class ShiftToday extends Component {
  constructor(props){
    super(props);
    this.state = {shifts:{}};
  }

  componentDidMount = () => {
    this.getShifts()
  }

  drawShifts = () => {
    if(this.state.shifts){
      return (
        <div>
          {this.mapShifts()}
          <ShiftForm getShifts={this.getShifts} clearSelectedShift={this.clearSelectedShift} reqType="create" />
        </div>
      );
    }
  }

  getShifts = () => {
    let self = this;
    axios.get("http://localhost:8080/shifts").then( (response) => {
    self.setState({shifts: response.data})
    }).catch( (error) => {
    console.log(error)
    });
  }

  mapShifts = () => {
    let shifts = this.state.shifts
      return shifts.map((shift,index) =>
      <div key={index}>
        <p className='upcoming-shift-time'>{shift.start_time} - {shift.end_time}</p>
        <p className='upcoming-shift-text'> {shift.group} | @{shift.location}</p> 
      </div>
    );
  }

  render() {
    if(this.props.numOfShifts === 0){
      return (
        <div className="transparent-box">
          <p className="no-shifts">Enjoy the day off!</p>
        </div>
      )
    }
    else {
      return (
        <div className="transparent-box">
          <div>
            <p>2:00PM -> 4:00PM</p>
            <br />
            <p> The LINK </p>
            <br />
            <p> Student | Service Worker</p>
          </div>
        </div>
      );
    }
  }

}

export default ShiftToday;