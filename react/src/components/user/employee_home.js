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
      <div class="tile is-ancestor">
        <div class="tile is-7 is-vertical is-parent">
          <div class="tile is-child">
            <CurrentShift />
          </div>
          <div class="tile is-child">
            <UpcomingShifts />
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child">
            <ShiftPool />
          </div>
        </div>
      </div>
    );
  }
}

export default EmployeeHome;