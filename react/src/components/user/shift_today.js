import React, {Component} from 'react';
import axios from 'axios';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import endOfToday from 'date-fns/endOfToday';
import getUnixTime from 'date-fns/getUnixTime'

class ShiftToday extends Component {
  constructor(props){
    super(props);
    this.state = {shifts:false};
  }

  componentDidMount = () => {
    this.getShifts()
  }

  drawShifts = () => {
    let shifts = this.state.shifts;
    let timeFormat = "hh:00";
    let pm = "a";
    if(this.state.shifts){
      return (
        <div className="transparent-box">
          <div>
          <p className="shift-time">{format(shifts[0].start_time * 1000, timeFormat)}<span className="pm">{format(shifts[0].start_time * 1000, pm)}</span> &#8594; {format(shifts[0].end_time * 1000, timeFormat)}<span className="pm">{format(shifts[0].end_time * 1000, pm)}</span></p>
          <br />
          <p className="shift-location"> {shifts[0].location} </p>
          <br />
          <p className="shift-role"> {shifts[0].group} </p>
          </div>
        </div>
      );
    }
  }

  getShifts = () => {
    let self = this;
    let startTime = getUnixTime(startOfToday());
    let endTime = getUnixTime(endOfToday());
    axios.get("http://localhost:8080/shifts/find_by_time_and_user/" + startTime + "/" + endTime).then( (response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    });
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
        <div>
          {this.drawShifts()}
        </div>
      );
    }
  }

}

export default ShiftToday;