import React, {Component} from 'react';
import Shift from './shift';
import Availability from './availability';

class GeneratedSchedule extends Component {
    drawShifts = () => {
        return this.props.shifts.map((shift,index) =>
        <div key={index}>
          <Shift shift={shift} />
        </div>
        )
    }
    render() {
        return <div>
            <h1>Shifts</h1>
            {this.drawShifts()}
            <h1>Availability</h1>
            <Availability />
        </div>
    }
}

export default GeneratedSchedule