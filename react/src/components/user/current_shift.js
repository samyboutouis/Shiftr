import React, {Component} from 'react';
import axios from 'axios';
import Clock from '../../clock.png';
import AllShiftsToday from '../shift/all_shifts_today'

class CurrentShift extends Component {
  constructor(props){
    super(props);
    this.state = {name: "", shiftsToday: 0, shifts: false};
  }

  getShifts = () => {
    let self = this;
    axios.get("http://localhost:8080/shifts").then( (response) => {
      self.setState({shifts: response.data.length});
      console.log(response.data.length);
      console.log("HII")
      this.determineState();
    }).catch( (error) => {
      console.log(error)
    });
  }

  determineState = () => {
    this.setState({name: localStorage.getItem("firstName"), shiftsToday: this.state.shifts});
  }

  componentDidMount() {
    this.determineState();
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

    return (
      <div className="background-pretty-gradient">
        <div>
          <p className="greeting">Hello, {this.state.name}.</p>
          <p className="landing-box">{landing}</p>
        </div>
        <AllShiftsToday numOfShifts={this.state.shiftsToday} affiliation={this.props.affiliation}/>
        <button className="clock-in"> 
          <img className="clock" src={Clock} alt="Clock"/>
          <span className="clock-text">Clock In</span>
        </button>
      </div>
    );
  }
}

export default CurrentShift;