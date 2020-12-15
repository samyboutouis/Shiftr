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
    return (
      <div className="tile is-gapless is-ancestor">
        <div className="tile is-7 is-vertical is-parent">
          <div className="tile is-child">
            <CurrentShift />
          </div>
          <div className="tile is-child">
            <UpcomingShifts />
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child">
            <ShiftPool />
          </div>
        </div>
      </div>
    );
  }
}

export default EmployeeHome;