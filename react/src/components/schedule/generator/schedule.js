import React, {Component} from 'react';
import Shift from './shift';
import UserAvailability from './userAvailability'
import Availability from './availability';

class GeneratedSchedule extends Component {
    drawShifts = () => {
        return this.props.data.shifts.map((shift,index) =>
        <div key={index}>
          <Shift shift={shift} />
        </div>
        )
    }

    drawUsers = () => {
        return this.props.data.users.map((user,index) =>
            <div key={index}>
                <UserAvailability user={user} />
            </div>
        )
      }

    render() {
        return <div>
            <h1>Shifts</h1>
            {this.drawShifts()}
            <h1>Availability</h1>
            {this.drawUsers()}
            {/* <Availability /> */}
        </div>
    }
}

export default GeneratedSchedule