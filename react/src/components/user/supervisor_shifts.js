import React, {Component} from 'react';
import axios from 'axios';
import AllShiftsToday from '../shift/all_shifts_today'

class SupervisorShifts extends Component {
  constructor(props){
    super(props);
    this.state = {name: "", shiftsToday: 0, shifts: false};
  }

  getShifts = () => {
    let self = this;
    axios.get("http://localhost:8080/shifts").then( (response) => {
      self.setState({shifts: response.data.length});
      this.determineState();
    }).catch( (error) => {
      console.log(error)
    });
  }

  determineState = () => {
    this.setState({name: localStorage.getItem("firstName"), shiftsToday: this.state.shifts});
  }

  componentDidMount() {
    this.getShifts();
  }

  render() {
    let landing = "No employees are scheduled to work today."
    if(this.state.shiftsToday > 0){
      if(this.state.shiftsToday === 1){
        landing = "You have one employee working today."
      }
      else{
        landing = "You have " + this.state.shiftsToday + " employees working today."
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