import React, {Component} from 'react';
import axios from 'axios';
import CurrentShift from "./current_shift"
import ShiftPool from '../shift/shift_pool'
import UpcomingShifts from '../shift/upcoming_shifts';
import startOfToday from 'date-fns/startOfToday';
import endOfToday from 'date-fns/endOfToday';
import getUnixTime from 'date-fns/getUnixTime';

class EmployeeHome extends Component {
  constructor(props){
    super(props);
    this.state = {name: "", shiftsToday: 0, shifts: [], additionalShifts: []};
  }

  getShifts = () => {
    let self = this;
    let startTime = getUnixTime(startOfToday());
    let endTime = getUnixTime(endOfToday());
    if(this.props.affiliation === 'student'){
      axios.get("http://localhost:8080/shifts/find_by_time_and_user/" + startTime + "/" + endTime).then( (response) => {
        let sortedShifts = response.data;
        sortedShifts.sort((a, b) => a.start_time - b.start_time);
        self.setState({name: localStorage.getItem("firstName"), shiftsToday: response.data.length, shifts: sortedShifts});
        if(self.state.shiftsToday > 1){
          let i = 0;
          for(i; i < self.state.shifts.length; i++){
            if(!self.state.shifts[i].hasOwnProperty("clocked_out")) break;
          }
          let additionalShifts = self.state.shifts.splice(i+1);
          let shifts = [];
          shifts[0] = self.state.shifts[i];
          self.setState({additionalShifts: additionalShifts, shifts: shifts});
        }
      }).catch( (error) => {
        console.log(error)
      });
    } else {
      axios.get("http://localhost:8080/shifts/find_time/" + startTime + "/" + endTime).then( (response) => {
        let sortedShifts = response.data;
        sortedShifts.sort((a, b) => a.start_time - b.start_time);
        self.setState({name: localStorage.getItem("firstName"), shiftsToday: response.data.length, shifts: sortedShifts});
      }).catch( (error) => {
        console.log(error)
      });
    }
  }

  componentDidMount() {
    this.getShifts();
  }

  render() {
    let home = []
    if(this.props.affiliation === 'student'){
      home.push(
        <div className="tile is-7 is-vertical is-parent" key="vertical">
          <div className="tile is-child">
            <CurrentShift affiliation={this.props.affiliation} name={this.state.name} shiftsToday={this.state.shiftsToday} shifts={this.state.shifts}/>
          </div>
          <div className="tile is-child">
            <UpcomingShifts additionalShifts={this.state.additionalShifts}/>
          </div>
        </div>
      );
    }
    else {
      home.push(
        <div className="tile is-7 is-parent" key="supervisor">
          <div className="tile is-child">
            <CurrentShift affiliation={this.props.affiliation} name={this.state.name} shiftsToday={this.state.shiftsToday} shifts={this.state.shifts}/>
          </div>
        </div>
      );
    }
    home.push(
      <div className="tile is-parent" key="pool">
        <div className="tile is-child">
          <ShiftPool />
        </div>
      </div>
    );
    return (
      <div className="tile is-gapless is-ancestor">
        {home}
      </div>
    );
  }
}

export default EmployeeHome;