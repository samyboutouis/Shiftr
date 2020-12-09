import React, {Component} from 'react';
import axios from 'axios';
import ScheduleKey from './key'
import Shift from './shift'
import CreateSchedule from './create'
import DayWeekMonth from './dayWeekMonth'
import * as Constants from '../../constants'

class ScheduleIndex extends Component {
  constructor(props){
    super();
    this.state= {shifts: false, selectedShift: false }
  }

  componentDidMount = () => {
    this.getShifts()
  }

  //TODO: get shifts for specific user
  getShifts = () => {
    let self = this;
    console.log('making web call');
    axios.get("http://localhost:8080/shifts/find_by_user/sl616").then( (response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  drawCalendar = () => {
    return <div>
        <div className="gradient"></div>
        <table className="days-of-week">
            <thead>
                <tr className="week">
                    <th className="day">Sunday</th>
                    <th className="day">Monday</th>
                    <th className="day">Tuesday</th>
                    <th className="day">Wednesday</th>
                    <th className="day">Thursday</th>
                    <th className="day">Friday</th>
                    <th className="day">Saturday</th>
                </tr>
            </thead>
        </table>
    </div>
  }

  drawShifts = () => {
    if(this.state.shifts){
      let shifts = this.state.shifts
      return shifts.map((shift,index) =>
        <div key={index}>
            <Shift shift={shift} />
        </div>
      )
    }
  }

  render(){
    return(
        <div>
          <DayWeekMonth />
          {this.drawCalendar()}
          <ScheduleKey groups={[
            {group: 'The Link', color: Constants.RED},
            {group: 'Lilly Library', color: Constants.PINK},
            {group: 'Co-Lab', color: Constants.DARKBLUE},
            {group: 'East Printers', color: Constants.PEACH},
            {group: 'Central Printers', color: Constants.LIGHTBLUE},
            {group: 'West Printers', color: Constants.DARKPURPLE},
            {group: 'Perkins Library', color: Constants.LIGHTPURPLE}]}/>
            {this.drawShifts()}
            <CreateSchedule />
        </div>
    )
  }
}


export default ScheduleIndex
