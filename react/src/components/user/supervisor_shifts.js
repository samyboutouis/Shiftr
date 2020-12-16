import React, {Component} from 'react';
// import axios from 'axios';
import AllShiftsToday from '../shift/all_shifts_today'

class SupervisorShifts extends Component {
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
    let landing = "No employees are scheduled to work today."
    if(this.state.shiftsToday > 0){
      if(this.state.shiftsToday === 1){
        landing = "You have one employee working today."
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
        <AllShiftsToday numOfShifts={this.state.shiftsToday}/>
      </div>
    );
  }
}

export default SupervisorShifts;