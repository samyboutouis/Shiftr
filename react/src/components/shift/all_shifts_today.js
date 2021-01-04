import React, {Component} from 'react';
import axios from 'axios';
import format from 'date-fns/format'
import startOfToday from 'date-fns/startOfToday';
import endOfToday from 'date-fns/endOfToday';
import getUnixTime from 'date-fns/getUnixTime';
import Clock from '../../clock.png';

class AllShiftsToday extends Component {
  constructor(props){
    super(props);
    this.state = {shifts: false};
  }

  componentDidMount = () => {
    this.getShifts()
  }

  drawShifts = () => {
    if(this.state.shifts){
      return (
        <div>
          {this.mapShifts()}
        </div>
      );
    }
  }

  getShifts = () => {
    let self = this;
    let startTime = getUnixTime(startOfToday());
    let endTime = getUnixTime(endOfToday());
    if(this.props.affiliation === 'student'){
      axios.get("http://localhost:8080/shifts/find_by_time_and_user/" + startTime + "/" + endTime).then( (response) => {
        self.setState({shifts: response.data})
      }).catch( (error) => {
        console.log(error)
      });
    }
    else {
      axios.get("http://localhost:8080/shifts/find_day/" + startTime + "/" + endTime).then( (response) => {
        self.setState({shifts: response.data})
      }).catch( (error) => {
        console.log(error)
      });
    }
  }

  mapShifts = () => {
    let shifts = this.state.shifts;
    let timeFormat = "hh:00";
    let pm = "a";
    return shifts.map((shift,index) => 
    <div key={index}>
      <div className="transparent-box">
        <div>
          <p className="shift-time">{format(shift.start_time * 1000, timeFormat)}<span className="pm">{format(shift.start_time * 1000, pm)}</span> &#8594; {format(shift.end_time * 1000, timeFormat)}<span className="pm">{format(shift.end_time * 1000, pm)}</span></p>
          <br />
          <p className="shift-location"> {shift.location} </p>
          <br />
          <p className="shift-role"> {shift.group} </p>
        </div>
      </div>
    </div>
    );
  }

  render() {
    let zeroShifts = "Enjoy the day off!"
    if(this.props.numOfShifts === 0){
      return (
        <div className="transparent-box">
          <p className="no-shifts">{zeroShifts}</p>
        </div>
      );
    }
    else {
      let shift = [];
      shift.push(<div>{this.drawShifts()}</div>);
      if(this.props.affiliation === 'student'){
        shift.push(
          <button className="clock-in" key="button"> 
            <img className="clock" src={Clock} alt="Clock"/>
            <span className="clock-text">Clock In</span>
          </button>
        );
      }
      return (
        <div>
          {shift};
        </div>
      );
    }
  }

}

export default AllShiftsToday;