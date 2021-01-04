import React, {Component} from 'react';
import axios from 'axios';
import format from 'date-fns/format'
import Clock from '../../clock.png';
import getUnixTime from 'date-fns/getUnixTime'

class AllShiftsToday extends Component {
  constructor(props){
    super(props);
    this.state = {clockedIn: false};
  }

  drawShifts = () => {
    if(this.props.shifts){
      return (
        <div>
          {this.mapShifts()}
        </div>
      );
    }
  }

  mapShifts = () => {
    let shifts = this.props.shifts;
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

  handleClick = () => {
    let self = this;
    let time = getUnixTime(Date.now());
    if(this.state.clockedIn){
      axios.put("http://localhost:8080/shifts/update/" + this.props.shifts[0]._id, {clocked_out: time}).then((response) => {
        self.setState({clockedIn: false});
      }).catch(function (err){  
        console.log(err)
      });
    } else {
      axios.put("http://localhost:8080/shifts/update/" + this.props.shifts[0]._id, {clocked_in: time}).then((response) => {
        self.setState({clockedIn: true});
      }).catch(function (err){  
        console.log(err)
      });
    }
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
      shift.push(<div key="shifts">{this.drawShifts()}</div>);
      if(this.props.affiliation === 'student'){
        let message = "";
        if(this.state.clockedIn){
          message = "Clock Out";
        } else {
          message = "Clock In";
        }
        shift.push(
          <button className="clock-in" key="button" onClick={this.handleClick}> 
            <img className="clock" src={Clock} alt="Clock"/>
            <span className="clock-text">{message}</span>
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