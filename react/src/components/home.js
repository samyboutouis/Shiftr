import React, {Component} from 'react';
import UserIndex from './user/index'
import ShiftIndex from './shift/index'
import ScheduleIndex from './schedule/index'
import Navbar from './navbar';
import OauthLogin from "./oauth/login"

class Home extends Component {
  constructor(props){
    super();
    this.state = {name: "World", navState: "Home"}
  }

  setNavState = (newPage) => {
    this.setState({navState: newPage})
  }

  showHome = () => {
    if (this.state.navState === "Shiftr" || this.state.navState === "Home"){
      return <div>
          <div style={{width: '100%'}}>
            {/*left column with gradient*/}
            <div className="background-pretty-gradient" style={{float:'left', width: '60%'}}>
              <div>
                <p className="greeting">Hello {this.state.name}</p>
                <p className="landing-box">You have (an unspecified amount) shifts today</p>
              </div>
              <div className="transparent-box">
                <p>a bunch of text about the shift(s) that user has today</p>
              </div>
            </div>
            {/*right column*/}
            <div style={{float:'right'}}>
              <p> hello </p>
              <OauthLogin />
            </div>
          </div>
          <div style={{clear:'both'}}>
          </div>
        </div>
    }else if(this.state.navState === "Availability"){
      return <UserIndex />
    }else if(this.state.navState === "Schedule"){
      return <ScheduleIndex />
    }else if(this.state.navState === "Hours") {
      return <ShiftIndex />
    }
  }


  render(){
    return(

      <div>
        <Navbar setNavState={this.setNavState} navState={this.state.navState} />
        <br/>
        {this.showHome()}
      </div>
    )
  }
}


export default Home;
