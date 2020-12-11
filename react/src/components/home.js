import React, {Component} from 'react';
import AvailabilityIndex from './availability/index'
import HoursIndex from './hours/index'
import ScheduleIndex from './schedule/index'
import EmployeeHome from './user/employee_home'

class Home extends Component {
  constructor(props){
    super();
    this.state = {navState: "Home"}
  }

  setNavState = (newPage) => {
    this.setState({navState: newPage})
  }

  showHome = () => {
    if (localStorage.getItem('accessToken') && localStorage.getItem('idToken')){
      if (this.state.navState === "Shiftr" || this.state.navState === "Home"){
        return <EmployeeHome />
      }else if(this.state.navState === "Availability"){
        return <AvailabilityIndex />
      }else if(this.state.navState === "Schedule"){
        return <ScheduleIndex /> 
      }else if(this.state.navState === "Hours") {
        return <HoursIndex /> //change these
      }
    }else{
      return <h1>boo</h1>
    }
  }

  render(){
    return(
      <div>
        <Nbar setNavState={this.setNavState} navState={this.state.navState} />
        <br/>
        {this.showHome()}
      </div>
      );
  }
}


export default Home;

