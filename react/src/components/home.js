import React, {Component} from 'react';
import AvailabilityIndex from './availability/index'
import HoursIndex from './hours/index'
import ScheduleIndex from './schedule/index'
import HomeIndex from './user/home_index'
import UserIndex from './user/index'
import Nbar from './navbar'
//import CalIndex from './availability/indexTwo'

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
    localStorage.clear();
    let url = "http://localhost:8080/saml/logout"
    window.location.href = url;
  }

  setNavState = (newPage) => {
    this.setState({navState: newPage})
  }

  showHome = () => {
    let home = [];
    if (localStorage.getItem('loggedIn')){
      home.push(<Nbar setNavState={this.setNavState} navState={this.state.navState} logout={this.samlLogout} key="nav"/>)
      if (this.state.navState === "Shiftr" || this.state.navState === "Home"){
        home.push(<HomeIndex key="home"/>);
      }else if(this.state.navState === "Availability"){
        home.push(<AvailabilityIndex key="availability"/>);
      }else if(this.state.navState === "Schedule"){
        home.push(<ScheduleIndex key="schedule"/>)
      }else if(this.state.navState === "Hours") {
        home.push(<HoursIndex key="hours"/>)
      }else if(this.state.navState === "Employees") {
        home.push(<UserIndex key="employees"/>)
      }
    }else{
      home.push(
        <div key="login" className="login-background">
          <h1 className="login_header">WELCOME TO SHIFTR</h1>
          <div className="login-container">
            <p className="login-message">LOGIN NOW TO START</p>
            <button className="login-button" onClick={this.samlLogin}>LOGIN</button>
          </div>
        </div>
      );
    } 
    return home;
  }

  render(){
    return (
      <div>
        {this.showHome()}
      </div>
    );
  }
}


export default Home;

