import React, {Component} from 'react';
import ShiftShow from './show'
import ShiftForm from './form'
import axios from 'axios';

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
        <button className='upcoming-shift-button' onClick={this.selectShift.bind(this, shift)}>Select Shift</button> 
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