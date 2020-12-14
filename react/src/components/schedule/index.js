import React, {Component} from 'react';
import ScheduleKey from './key';
import Shift from './shift';
import DayWeekMonth from './dayWeekMonth';
import * as Constants from '../../constants';
import MonthCalendar from './month.js';
import WeekCalendar from './week.js'
import DayCalendar from './day.js'
import axios from 'axios';
import ShiftIndex from '../shift/index.js'
class ScheduleIndex extends Component {
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
          <div > {/* the body of the page under the toggle */}
            <div className="schedule-calendar"> {/* calendar */}

              {this.drawCalendar()}
              <ShiftIndex/>
            </div>

            <div className="key"> {/* legend*/}

              <ScheduleKey groups={[
                {group: 'The Link', color: Constants.RED},
                {group: 'Lilly Library', color: Constants.PINK},
                {group: 'Co-Lab', color: Constants.DARKBLUE},
                {group: 'East Printers', color: Constants.PEACH},
                {group: 'Central Printers', color: Constants.LIGHTBLUE},
                {group: 'West Printers', color: Constants.DARKPURPLE},
                {group: 'Perkins Library', color: Constants.LIGHTPURPLE}]}/>
            </div>
          </div>
            {/* {this.drawShifts()} */}
        </div>
    )
  }
}


export default ScheduleIndex
