import React, {Component} from 'react';
import ShiftShow from './show'
import axios from 'axios';
import format from "date-fns/format";

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
      return( 
        <div className='tile is-ancestor'>
          <div className='tile is-parent is-vertical'>
            {this.mapShifts()}
          </div>
        </div>
      );
    }
  }

  getShifts = () => {
    let self = this;
    axios.get("http://localhost:8080/shifts/find_open/open").then((response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  mapShifts = () => {
    if (this.state.shifts) {
    let dateFormat = "eee dd MMM";
    let timeFormat = "hh:00aaaa";
    let shifts = this.state.shifts
    return shifts.map((shift,index) =>
    <div key={index} className='tile is-child columns is-mobile'>
      <div className='column is-3 upcoming-shift-date'>
        <p>{format(shift.start_time * 1000, dateFormat)}</p>
      </div>
      <div className='column is-6'>
        <p className='upcoming-shift-time'>{format(shift.start_time * 1000, timeFormat)} - {format(shift.end_time * 1000, timeFormat)}</p>
        <p className='upcoming-shift-text'> {shift.group} </p>
        <p className='upcoming-shift-text'> @{shift.location}</p>
      </div>
      <div className='column is-3'>
        <button className='open-shift-button' onClick={() => {this.selectShift.bind(this, shift); this.claim(shift);}}>Claim</button>
      </div>
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
