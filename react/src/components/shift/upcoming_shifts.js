import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";

class UpcomingShifts extends Component {
  constructor(props){
    super(props)
    this.state= {shifts: false}
  }

  componentDidMount = () => {
    this.getShifts()
  }

  drawShifts = () => {
    if(this.state.shifts && !this.state.selectedShift){
      return (
        <div className='tile is-ancestor'>
          <div className='tile is-parent is-vertical'>
            {this.mapShifts()}
            {/* <ShiftForm getShifts={this.getShifts} clearSelectedShift={this.clearSelectedShift} reqType="create" /> */}
          </div>
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
    let shifts = this.state.shifts;
    let dateFormat = "iii ee MMM";
    let timeFormat = "hh:00aaaa";
    return shifts.map((shift,index) =>
    <div key={index} className='tile is-child columns is-mobile'>
      <div className='column is-3 upcoming-shift-date'>
        <p>{format(new Date(shift.start_time), dateFormat)}</p>
      </div>
      <div className='column is-9'>
        <p className='upcoming-shift-time'>{format(new Date(shift.start_time), timeFormat)} - {format(new Date(shift.end_time), timeFormat)}</p>
        <p className='upcoming-shift-text'> {shift.group} </p>
        <p className='upcoming-shift-text'> @{shift.location}</p>
      </div>
    </div>
    );
  }

  render(){
    return(
      <div className="upcoming-shift">
          <p className="upcoming-shift-title">Your upcoming shifts</p>
          {this.drawShifts()}
      </div>
    );
  }
}

export default UpcomingShifts