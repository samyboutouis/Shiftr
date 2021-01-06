import React, {Component} from 'react';
import AvailabilityIndex from './availability/index'
import HoursIndex from './hours/index'
import ScheduleIndex from './schedule/index'
import HomeIndex from './user/home_index'
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
      home.push(<Nbar setNavState={this.setNavState} navState={this.state.navState} logout={this.samlLogout} affiliation={localStorage.getItem('affiliation')} key="nav"/>)
      if (this.state.navState === "Shiftr" || this.state.navState === "Home"){
        home.push(<HomeIndex affiliation={localStorage.getItem('affiliation')} key="home"/>);
      }else if(this.state.navState === "Availability"){
        home.push(<AvailabilityIndex key="availability"/>);
      }else if(this.state.navState === "Schedule"){
        home.push(<ScheduleIndex key="schedule"/>)
      }else if(this.state.navState === "Hours") {
        home.push(<HoursIndex key="hours"/>)
      }
    }else{
      home.push(
        <button onClick={this.samlLogin} key="login">Login</button>
      );
    } 
    return home;
  }

  render(){
    return(
      <div>
        {this.showHome()}
      </div>
      );
  }
}


export default Home;

