import React, {Component} from 'react';
import Key from './Key';
import Shift from '../schedule/shift';
import DayWeekMonth from '../schedule/dayWeekMonth';
import * as Constants from '../../constants';
import MonthCalendar from '../schedule/month';
import WeekCalendar from '../schedule/week'
import DayCalendar from '../schedule/day'
import axios from 'axios';
import AvailabilityForm from './form'


class CalIndex extends Component {
  constructor(props){
    super();
    this.state= {shifts: false, selectedShift: false, navState: "Week" }
  }

  setNavState = (newPage) => {
    this.setState({navState: newPage})
  }

  componentDidMount = () => {
    this.getShifts()
  }

  //TODO: get shifts for specific user
  getShifts = () => {
    let self = this;
    axios.get("http://localhost:8080/shifts/find_by_user/sl616").then( (response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  // drawCalendar = () => {
  //   return <div>
  //       <div className="gradient"></div>
  //       <table className="days-of-week">
  //           <thead>
  //               <tr className="week">
  //                   <th className="day">Sunday</th>
  //                   <th className="day">Monday</th>
  //                   <th className="day">Tuesday</th>
  //                   <th className="day">Wednesday</th>
  //                   <th className="day">Thursday</th>
  //                   <th className="day">Friday</th>
  //                   <th className="day">Saturday</th>
  //               </tr>
  //           </thead>
  //       </table>
  //   </div>
  // }

  drawCalendar = () => {
    if (this.state.navState === "Week"){
      console.log("week")
      return <div>
          <WeekCalendar />
        </div>
    }else if(this.state.navState === "Day"){
      return <div>
          <DayCalendar/>
        </div>
    }else if(this.state.navState === "Month"){
      return <div>
        <MonthCalendar />
        </div>
    }
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
          <DayWeekMonth setNavState={this.setNavState} navState={this.state.navState} />
          <br/>
          <div> {/* the body of the page under the toggle */}
            <div className="schedule-calendar"> {/* calendar */}

              {this.drawCalendar()}
            </div>

            <div class = "ml-5">Location: </div>
        <Key groups={[
            {group: 'The Link', color: Constants.RED},
            {group: 'Lilly Library', color: Constants.PINK},
            {group: 'Co-Lab', color: Constants.DARKBLUE},
            {group: 'East Printers', color: Constants.PEACH},
            {group: 'Central Printers', color: Constants.LIGHTBLUE},
            {group: 'West Printers', color: Constants.DARKPURPLE},
            {group: 'Perkins Library', color: Constants.LIGHTPURPLE}]}/>
        <div class = "ml-5">Preference: </div>
        <Key groups={[
            {group: 'Most Preferred', color: Constants.GREEN},
            {group: 'Somewhat Preferred', color: Constants.YELLOW},
            {group: 'Least Preferred', color: Constants.LIGHTORANGE},
            {group: 'Unavailable', color: Constants.DARKRED}]}/>
        <AvailabilityForm />
            {/* {this.drawShifts()} */}
            {/* <CreateSchedule /> */}
        </div>
        </div>
    )
  }
}


export default CalIndex 