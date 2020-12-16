import React, {Component} from 'react';
// import axios from 'axios';
import Clock from '../../clock.png';
import ShiftToday from './shift_today'

class CurrentShift extends Component {
  constructor(props){
    super(props);
    this.state = {name: "", shiftsToday: 0};
  }

  determineState = () => {
    this.setState({name: localStorage.getItem("firstName"), shiftsToday: 1});
  }

  componentDidMount() {
    this.determineState();
  }

  render() {
    let landing = "You have no shifts today."
    if(this.state.shiftsToday > 0){
      if(this.state.shiftsToday === 1){
        landing = "You have one shift today."
      }
      else{
        landing = "You have " + this.state.shiftsToday + " shifts today."
      }
    }
    return (
      <div className="background-pretty-gradient">
        <div>
          <p className="greeting">Hello, {this.state.name}.</p>
          <p className="landing-box">{landing}</p>
        </div>
        <ShiftToday numOfShifts={this.state.shiftsToday}/>
        <button className="clock-in"> 
          <img className="clock" src={Clock} alt="Clock"/>
          <span className="clock-text">Clock In</span>
        </button>
      </div>
    );
  }
}

export default CurrentShift;