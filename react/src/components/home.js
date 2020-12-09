import React, {Component} from 'react';
import AvailabilityIndex from './availability/index'
import Navbar from './navbar';
import OauthLogin from "./oauth/login"
import OpenShifts from './shift/open'
import Pool from '../pool.png';
import Clock from '../clock.png';
import ShiftIndex from './shift/index'
import ScheduleIndex from './schedule/index'

class Home extends Component {
  constructor(props){
    super();
    this.state = {navState: "Home", oauthToken: localStorage.getItem('dukeOauthToken')}
  }

  setNavState = (newPage) => {
    this.setState({navState: newPage})
  }

  showHome = () => {
    if (localStorage.getItem('accessToken') && localStorage.getItem('idToken')){
      if (this.state.navState === "Shiftr" || this.state.navState === "Home"){
        return <div>
          {/*begin two columned-first section*/}
          <div style={{width: '100%'}}>
            {/*left column with gradient*/}
            <div style={{float:'left', width: '60%'}}>
              <div className="background-pretty-gradient">
              <div>
                <p className="greeting">Hello {this.state.name}</p>
                <p className="landing-box">You have (an unspecified amount) shifts today</p>
              </div>
              <div className="transparent-box">
                <p>a bunch of text about the shift(s) that user has today</p>
              </div>
              <button className="clock-in"> <img className="clock" alt="Clock Icon" src={Clock} style={{height:'2em', margin: '.5em'}}/> Clock In </button>
              </div>
              <p style={{padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>Your Upcoming Shifts</p>
              <ShiftIndex />
            </div>
            {/*right column*/}
              <div className="shift-pool">
                <p style={{textAlign: 'left', padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>
                <img src={Pool} alt="Pool Icon" style={{height:'1em', margin: '0 .5em 0 2em'}}/> Shift Pool </p>
                {/*FOR EACH OPEN/PENDING SHIFT IN POOL*/}
                <div>
                  <OpenShifts />
                </div>
              </div>
            </div>
            {/* <UserIndex />
          <ShiftIndex /> */}
        </div>
    }else if(this.state.navState === "Availability"){
      return <AvailabilityIndex /> 
    }else if(this.state.navState === "Schedule"){
      return <ScheduleIndex /> //change these
    }else if(this.state.navState === "Hours") {
      return <ShiftIndex /> //change these
    }
  }else{
      return <OauthLogin />
    }
  }

  render(){
    return(
      <div>
        <Navbar setNavState={this.setNavState} navState={this.state.navState} />
        <br/>
        {this.showHome()}
      </div>
      );
  }
}


export default Home;
