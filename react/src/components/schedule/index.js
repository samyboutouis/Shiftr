import React, {Component} from 'react';
import axios from 'axios';
import ScheduleKey from './key';
import Shift from './shift';
import DayWeekMonth from './dayWeekMonth';
import * as Constants from '../../constants';


import OpenShifts from '../shift/open';
import ShiftIndex from '../shift/index';


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
    console.log('making web call');
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
          <OpenShifts />
        </div>
    }else if(this.state.navState === "Day"){
      return <div>
          <ShiftIndex />
        </div>
    }else if(this.state.navState === "Month"){
      return <div>
          <ShiftIndex />
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

          <div> {/* calendar */}

            {this.drawCalendar()}
          </div>

          <div> {/* legend*/}

            <ScheduleKey groups={[
              {group: 'The Link', color: Constants.RED},
              {group: 'Lilly Library', color: Constants.PINK},
              {group: 'Co-Lab', color: Constants.DARKBLUE},
              {group: 'East Printers', color: Constants.PEACH},
              {group: 'Central Printers', color: Constants.LIGHTBLUE},
              {group: 'West Printers', color: Constants.DARKPURPLE},
              {group: 'Perkins Library', color: Constants.LIGHTPURPLE}]}/>
          </div>

            {this.drawShifts()}
        </div>
    )
  }
}


export default ScheduleIndex
