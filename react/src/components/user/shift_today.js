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
            <p className="shift-time">2:00<span className="pm">PM</span> &#8594; 4:00<span className="pm">PM</span></p>
            <br />
            <p className="shift-location"> The LINK </p>
            <br />
            <p className="shift-role"> Student | Service Desk</p>
          </div>
        </div>
      );
    }
  }

}

export default ShiftToday;