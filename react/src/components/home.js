import React, {Component} from 'react';
import AvailabilityIndex from './availability/index'
import Navbar from './navbar';
import OauthLogin from "./oauth/login"
import OpenShifts from './shift/open'
import Pool from '../pool.png';
import Clock from '../clock.png';
import ShiftIndex from './shift/index'
import ScheduleIndex from './schedule/index'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
        return <Container fluid>
          {/*begin two columned-first section*/}
          <Row>
            {/*left column with gradient*/}
            <Col md={7}>
              <div className="background-pretty-gradient">
                <div>
                  <p className="greeting">Hello {this.state.name}</p>
                  <p className="landing-box">You have (an unspecified amount) shifts today</p>
                </div>
                <div className="transparent-box">
                  <p>a bunch of text about the shift(s) that user has today</p>
                </div>
                <button className="clock-in"> <img className="clock" src={Clock} alt="" style={{height:'2em', margin: '.5em'}}/> Clock In </button>
              </div>
              <p style={{padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>Your Upcoming Shifts</p>
              <ShiftIndex />
            </Col>
            {/*right column*/}
            <Col md={5}>
              <div className="shift-pool">
                <p style={{textAlign: 'left', padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>
                <img src={Pool} alt="" style={{height:'1em', margin: '0 .5em 0 2em'}}/> Shift Pool </p>
                {/*FOR EACH OPEN/PENDING SHIFT IN POOL*/}
                <div>
                  <OpenShifts />
                </div>
              </div>
            </Col>
          </Row>
            {/* <UserIndex />
          <ShiftIndex /> */}
        </Container>
    }else if(this.state.navState === "Availability"){
      return <AvailabilityIndex />
    }else if(this.state.navState === "Schedule"){
      return <ScheduleIndex />
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
