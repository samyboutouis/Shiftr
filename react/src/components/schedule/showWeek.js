import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import getUnixTime from "date-fns/getUnixTime"

class ShowWeek extends Component {
  constructor(props){
    super()
    this.state= {shifts: false}
  }

  componentDidMount = () => {
    this.getShifts()
  }


  getShifts = (props) => {

    let self = this
    const start = getUnixTime(startOfDay(this.props.day))
    const end = getUnixTime(endOfDay(this.props.day))
    axios.get("http://localhost:8080/shifts/find_time/" + start + "/" + end ).then( (response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  drawShifts = () => {
    if(this.state.shifts){
      return <div>
        {this.mapShifts()}
      </div>
    }
  }
  mapShifts = () => {
    let shifts = this.state.shifts
    let dateFormat = "HH mm"
    return shifts.map((shift,index) =>
      <div key={index}>
        <p className="calendar-week-entry">{format(shift.start_time, dateFormat)} - {format(shift.end_time, dateFormat)}</p>
        {/* <p className='upcoming-shift-text'> {shift.group} | @{shift.location} | {shift._id}</p>*/}
      </div>
    )
  }


  render(){


    return(
     <div>
        {this.drawShifts()}
      </div>

    )
  }
}

export default ShowWeek;
