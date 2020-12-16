import React, {Component} from 'react';
import CurrentShift from "./current_shift"
import ShiftPool from '../shift/shift_pool'

class SupervisorHome extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="tile is-gapless is-ancestor">
        <div className="tile is-7 is-parent">
          <div className="tile is-child">
            <CurrentShift />
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

export default SupervisorHome;