import React, {Component} from 'react';
import axios from 'axios';
import format from 'date-fns/format'
import Clock from '../../clock.png';
import getUnixTime from 'date-fns/getUnixTime'

class AllShiftsToday extends Component {
  constructor(props){
    super(props);
    this.state = {clockedIn: false, clockedOut: false, shifts: []};
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
    let timeFormat = "hh:mm";
    let pm = "a";
    return shifts.map((shift,index) => {
      let person = "Open Shift";
      let location = <p className="shift-location"> {shift.location} </p>;
      if(shift.hasOwnProperty("employee") && (localStorage.getItem('role')==='supervisor' || localStorage.getItem('role')==='admin')){
        let firstName = shift.employee.name.split(" ")[0];
        let lastName = shift.employee.name.split(" ")[1];
        person = firstName + " " + lastName.charAt(0) + ".";
        location = <p className="shift-location">{person} @ {shift.location} </p>;
      }
      return (
        <div key={index}>
          <div className="transparent-box">
            <div>
              <p className="shift-time">{format(shift.start_time * 1000, timeFormat)}<span className="pm">{format(shift.start_time * 1000, pm)}</span> &#8594; {format(shift.end_time * 1000, timeFormat)}<span className="pm">{format(shift.end_time * 1000, pm)}</span></p>
              {location}
              <p className="shift-role"> {shift.group} </p>
            </div>
          </div>
        </div>
      ); 
    });
  }

  handleClick = () => {
    let self = this;
    let time = getUnixTime(Date.now());
    if(time + 600 < this.props.shifts[0].start_time && !this.state.clockedIn){
      alert("It is too early to clock in to your shift! Please wait until 10 minutes before to clock in."); // 10 minutes before or earlier
    } else if(this.state.clockedIn && window.confirm("Are you sure you want to clock out?")){
      axios.put("http://localhost:8080/shifts/update/" + this.props.shifts[0]._id, {clocked_out: time, status: "completed"}).then((response) => {
        self.setState({clockedIn: false, clockedOut: true});
      }).catch(function (err){  
        console.log(err)
      });
    } else if(window.confirm("Are you sure you want to clock in?")){
      axios.put("http://localhost:8080/shifts/update/" + this.props.shifts[0]._id, {clocked_in: time}).then((response) => {
        self.setState({clockedIn: true});
      }).catch(function (err){  
        console.log(err)
      });
    }
  }

  componentDidMount() {
    console.log(this.props);
  }

  showShift = () => {
    let zeroShifts = "Enjoy the time off!"
    if(this.props.numOfShifts === 0 || this.state.clockedOut){
      return (
        <div className="transparent-box">
          <p className="no-shifts">{zeroShifts}</p>
        </div>
      );
    }
    else {
      let shift = [];
      shift.push(<div key="shifts">{this.drawShifts()}</div>);
      if(localStorage.getItem('role')==='employee'){
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

  render() {
    return (
      <div>
        {this.showShift()}
      </div>
    );
  }
}

export default AllShiftsToday;