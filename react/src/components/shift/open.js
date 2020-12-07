import React, {Component} from 'react';
import ShiftShow from './show'
import axios from 'axios';

class OpenShifts extends Component {
  constructor(props){
    super()
    this.state= {shifts: [], selectedShift: false}
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
      return <div>
        {this.mapShifts()}
      </div>
    }
  }

  getShifts = () => {
    let self = this;
    console.log('making web call');
    //i only want shifts with status: true
    axios.get("http://localhost:8080/shifts/find_open/true").then((response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  mapShifts = () => {
    if (this.state.shifts) {
      console.log(this.state.shifts)
    let shifts = this.state.shifts
    return shifts.map((shift,index) =>
      <div key={index}>
        <p className='open-shift-time'>{shift.start_time} - {shift.end_time}</p>
        <p className='open-shift-text'> {shift.group} | @{shift.location}</p>
        <button className='open-shift-button' onClick={() => {this.selectShift.bind(this, shift); this.claim(shift);}}>Select Shift</button>
      </div>
    )
  }
}

  selectShift = (shift) => {
    this.setState({selectedShift: shift})

  }

// this function adds a netid to a shift on buttonclick in the shift pool
  claim = (shift) => {
    let form_data = new FormData();
    form_data.append("netid", "sl616"); // CHANGE FORM DATA TO APPEND USER'S NETID once login/logout is finalized
    axios.put("http://localhost:8080/shifts/update/" + shift._id, form_data).then( (response) => {
      console.log('success, woo! (probably)')
    }).catch( (error) => {
      console.log(error)
    });
  }

  render(){
    return(
      <div>
        {this.drawShifts()}
      </div>
    )
  }


}
export default OpenShifts
