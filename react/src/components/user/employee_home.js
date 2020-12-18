import React, {Component} from 'react';
import CurrentShift from "./current_shift"
import ShiftPool from '../shift/shift_pool'
import UpcomingShifts from '../shift/upcoming_shifts';

class EmployeeHome extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    let home = []
    if(this.props.affiliation === 'student'){
      home.push(
        <div className="tile is-7 is-vertical is-parent" key="vertical">
          <div className="tile is-child">
            <CurrentShift affiliation={this.props.affiliation}/>
          </div>
          <div className="tile is-child">
            <UpcomingShifts />
          </div>
        </div>
      );
    }
    else {
      home.push(
        <div className="tile is-7 is-parent" key="supervisor">
          <div className="tile is-child">
            <CurrentShift affiliation={this.props.affiliation}/>
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