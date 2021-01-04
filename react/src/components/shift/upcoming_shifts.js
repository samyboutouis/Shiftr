import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import startOfTomorrow from 'date-fns/startOfTomorrow'
import endOfWeek from 'date-fns/endOfWeek'
import getUnixTime from 'date-fns/getUnixTime'

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
          </div>
        </div>
      );
    }
  }

  getShifts = () => {
    let self = this;
    let startTime = getUnixTime(startOfTomorrow());
    let endTime = getUnixTime(endOfWeek(Date.now()));
    axios.get("http://localhost:8080/shifts/find_by_time_and_user/" + startTime + "/" + endTime).then( (response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  mapShifts = () => {
    let shifts = this.state.shifts;
    shifts = this.props.additionalShifts.concat(shifts);
    let dateFormat = "eee dd MMM";
    let timeFormat = "hh:00aaaa";
    return shifts.map((shift,index) =>
    <div key={index} className='tile is-child columns is-mobile'>
      <div className='column is-3 upcoming-shift-date'>
        <p>{format(shift.start_time * 1000, dateFormat)}</p>
      </div>
      <div className='column is-9'>
        <p className='upcoming-shift-time'>{format(shift.start_time * 1000, timeFormat)} - {format(shift.end_time * 1000, timeFormat)}</p>
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