import React, {Component} from 'react';
import AvailabilityIndex from './availability/index'
import HoursIndex from './hours/index'
import ScheduleIndex from './schedule/index'
import EmployeeHome from './user/employee_home'
import Nbar from './navbar'

class Home extends Component {
  constructor(props){
    super();
    this.state = {navState: "Home"}
  }

  samlLogin = () => {
    let url = "https://shib.oit.duke.edu/idp/profile/SAML2/Unsolicited/SSO?providerId=https://shiftr.colab.duke.edu"
    window.location.href = url;
  }

  samlLogout = () => {
    localStorage.removeItem("loggedIn");
    let url = "http://localhost:8080/saml/logout"
    window.location.href = url;
  }

  setNavState = (newPage) => {
    this.setState({navState: newPage})
  }

  showHome = () => {
    if (localStorage.getItem('loggedIn')){
      if (this.state.navState === "Shiftr" || this.state.navState === "Home"){
        return (
          <div>
            <Nbar setNavState={this.setNavState} navState={this.state.navState} />
            <EmployeeHome />
          </div>
        );
      }else if(this.state.navState === "Availability"){
        return (
          <div>
            <Nbar setNavState={this.setNavState} navState={this.state.navState} />
            <AvailabilityIndex />
          </div>
        );
      }else if(this.state.navState === "Schedule"){
        return (
          <div>
            <Nbar setNavState={this.setNavState} navState={this.state.navState} />
            <ScheduleIndex />
          </div>
        );
      }else if(this.state.navState === "Hours") {
        return (
          <div>
            <Nbar setNavState={this.setNavState} navState={this.state.navState} />
            <HoursIndex />
          </div>
        );
      }
    }else{
      return <div>
        <button onClick={this.samlLogin}>Login</button>
      </div>
    }
  }

  render(){
    return(
      <div>
        {this.showHome()}
        <button onClick={this.samlLogout}>Logout</button>
      </div>
      );
  }
}


export default Home;

