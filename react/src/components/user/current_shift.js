import React, {Component} from 'react';
import axios from 'axios';
import Clock from '../../clock.png';
import AllShiftsToday from '../shift/all_shifts_today';
import startOfToday from 'date-fns/startOfToday';
import endOfToday from 'date-fns/endOfToday';
import getUnixTime from 'date-fns/getUnixTime';

class CurrentShift extends Component {
  constructor(props){
    super(props);
    this.state = {name: "", shiftsToday: 0};
  }

  getShifts = () => {
    let self = this;
    let startTime = getUnixTime(startOfToday());
    let endTime = getUnixTime(endOfToday());
    console.log(startTime + " " + endTime);
    if(this.props.affiliation === 'student'){
      axios.get("http://localhost:8080/shifts/find_by_time_and_user/" + startTime + "/" + endTime).then( (response) => {
        self.setState({name: localStorage.getItem("firstName"), shiftsToday: response.data.length});
      }).catch( (error) => {
        console.log(error)
      });
    }
    else {
      axios.get("http://localhost:8080/shifts/find_time/" + startTime + "/" + endTime).then( (response) => {
        self.setState({name: localStorage.getItem("firstName"), shiftsToday: response.data.length});
      }).catch( (error) => {
        console.log(error)
      });
    }
  }

  componentDidMount() {
    this.getShifts();
  }

  render() {
    let landing = "You have no shifts today."
    if(this.props.affiliation === 'student'){
      if(this.state.shiftsToday > 0){
        if(this.state.shiftsToday === 1){
          landing = "You have one shift today."
        }
        else{
          landing = "You have " + this.state.shiftsToday + " shifts today."
        }
      }
    }
    else {
      if(this.state.shiftsToday === 0){
        landing = "No employees are scheduled to work today."
      }
      else {
        if(this.state.shiftsToday === 1){
          landing = "You have one employee working today."
        } 
        else{
          landing = "You have " + this.state.shiftsToday + " employees working today."
        }
      }
    }
    let shift = []
    shift.push(
      <div key="greeting">
        <p className="greeting">Hello, {this.state.name}.</p>
        <p className="landing-box">{landing}</p>
      </div>
    );
    shift.push(<AllShiftsToday numOfShifts={this.state.shiftsToday} affiliation={this.props.affiliation} key="shifts"/>);
    if(this.props.affiliation === 'student'){
      shift.push(
        <button className="clock-in" key="button"> 
          <img className="clock" src={Clock} alt="Clock"/>
          <span className="clock-text">Clock In</span>
        </button>
      );
    }
    return (
      <div className="background-pretty-gradient">
        {shift}
      </div>
    );
  }
}

export default CurrentShift;