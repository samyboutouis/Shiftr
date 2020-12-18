import React, {Component} from 'react';
import Shift from './shift';
import UserAvailability from './userAvailability'
import Availability from './availability';
import format from "date-fns/format";
import getHours from "date-fns/getHours"
import getDay from "date-fns/getDay"
import getMinutes from "date-fns/getMinutes"
import differenceInMinutes from "date-fns/differenceInMinutes"

class GeneratedSchedule extends Component {
    // drawShifts = () => {
    //     return this.props.data.shifts.map((shift,index) =>
    //     <div key={index}>
    //       <Shift shift={shift} />
    //     </div>
    //     )
    // }

    drawShifts = () => {
        var cells=[];
        this.props.data.shifts.map((shift,index) =>
            cells.push( <div className="calendar-week-entry" style={{position: "absolute", left: getDay(shift.start_time*1000)*200, width: 150, top: (getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000))*6/5, height: differenceInMinutes(shift.end_time*1000, shift.start_time*1000)*9/10}}>
                    <Shift shift={shift} group={this.props.data.group}/></div>
        ))
        return cells
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
            {this.drawShifts()}
            <div className="unscheduled-availability">
                {this.drawUsers()}
            </div>
            {/* <Availability /> */}
        </div>
    }
}

export default GeneratedSchedule