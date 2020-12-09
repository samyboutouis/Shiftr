import React, {Component} from 'react';
import AvailabilityIndex from './availability/index'
import Nbar from './navbar';
import CurrentShift from "./user/current_shift"
import OauthLogin from "./oauth/login"
import OpenShifts from './shift/open'
import Pool from '../pool.png';
import ShiftIndex from './shift/index'
import ScheduleIndex from './schedule/index'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
        return <Container fluid>
          <Row>
            <Col md={7}>
              <CurrentShift />
              <p style={{padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>Your Upcoming Shifts</p>
              <ShiftIndex />
            </Col>
            <Col md={5}>
              <div className="shift-pool">
                <p style={{textAlign: 'left', padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>
                <img src={Pool} style={{height:'1em', margin: '0 .5em 0 2em'}}/> Shift Pool </p>
                {/*FOR EACH OPEN/PENDING SHIFT IN POOL*/}
                <div>
                  <OpenShifts />
                </div>
              </div>
            </Col>
          </Row>
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
        <Nbar setNavState={this.setNavState} navState={this.state.navState} />
        <br/>
        {this.showHome()}
      </div>
      );
  }
}


export default Home;
