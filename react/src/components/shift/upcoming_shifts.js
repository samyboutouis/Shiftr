import React, {Component} from 'react';
import ShiftShow from './show'
// import ShiftForm from './form'
import axios from 'axios';
import format from "date-fns/format";

class UpcomingShifts extends Component {
  constructor(props){
    super(props)
    this.state= {shifts: false, selectedShift: false}
  }

  componentDidMount = () => {
    this.getShifts()
  }

  clearSelectedShift = () => {
    this.setState({ selectedShift: false})
  }

  drawSelectedShift = () => {
    if(this.state.selectedShift){
      return <ShiftShow clearSelectedShift={this.clearSelectedShift} shift={this.state.selectedShift} getShifts={this.getShifts} />
    }
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

  selectShift = (shift) => {
    this.setState({selectedShift: shift})
  }

  render(){
    return(
      <div className="upcoming-shift">
          <p className="upcoming-shift-title">Your upcoming shifts</p>
          {this.drawShifts()}
          {this.drawSelectedShift()}
      </div>
    );
  }
}

export default UpcomingShifts