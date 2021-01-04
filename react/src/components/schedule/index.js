import React, {Component} from 'react';
import ScheduleKey from './key';
import GeneratedSchedule from './generator/schedule';
import DayWeekMonth from './dayWeekMonth';
import * as Constants from '../../constants';
import MonthCalendar from './month.js';
import WeekCalendar from './week.js'
import DayCalendar from './day.js'
import BuildSchedule from './generator/build'
import axios from 'axios';

class ScheduleIndex extends Component {
  constructor(props){
    super();
    this.state= {shifts: false, selectedShift: false, navState: "Week", buildSchedule: false, testing: null }
  }

  componentDidMount = () => {
    this.getShifts()
    // this.getTestData()
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

  getTestData = () => {
    let self = this;
    axios.get("http://localhost:8080/temp_shifts/").then( (response) => {
//    axios.get("http://localhost:8080/shifts/").then( (response) => {
    self.setState({testing: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  displayCalendar = () => {
    if(!this.state.buildSchedule){
      return(
        <div>
          <DayWeekMonth setNavState={this.setNavState} navState={this.state.navState} />
          <br/>
          <div > {/* the body of the page under the toggle */}
            <div className="schedule-calendar"> {/* calendar */}
              {this.drawCalendar()}
            </div>
            <div className="key"> {/* legend*/}
              <ScheduleKey groups={[
                {group: 'MPS', color: Constants.RED},
                {group: 'Co-Lab Services', color: Constants.PINK},
                {group: 'Tech Tutors', color: Constants.DARKBLUE},
                {group: 'Labs and Training', color: Constants.PEACH},
                {group: 'Office Hours', color: Constants.LIGHTBLUE},
                {group: 'DesignHub', color: Constants.DARKPURPLE}]}/>
            </div>
          </div>
        </div>
      )
    }
  }

  setNavState = (newPage) => {
    this.setState({navState: newPage})
  }

  drawCalendar = () => {
    if (this.state.navState === "Week"){
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

  buildSchedule = () => {
    if(this.state.buildSchedule === true){
      return <div>
        <button className='build-schedule-button' onClick={this.toggleBuildSchedule.bind(this, false)}>Back To Schedule </button>
        <BuildSchedule toggleBuildSchedule={this.toggleBuildSchedule} />
      </div>
    }
    else if(this.state.buildSchedule) {
      return <div>
          <button className='build-schedule-button' onClick={this.toggleBuildSchedule.bind(this, false)}>Back To Schedule </button>
          <GeneratedSchedule data = {this.state.buildSchedule} />
        </div>
    } else {
      return <button className='is-pulled-right mx-6 build-schedule-button' onClick={this.toggleBuildSchedule.bind(this, true)}>Go To Schedule Generator </button>
    }
  }

  toggleBuildSchedule = (value) => {
    this.setState({ buildSchedule: value})
  }

  testing = () => {
    if(this.state.testing) {
      return <GeneratedSchedule data = {this.state.testing} />
    }
  }

  render(){
    return(
        <div>
          {this.displayCalendar()}
          {this.buildSchedule()}
          {this.testing()}
        </div>
    )
  }
}


export default ScheduleIndex
