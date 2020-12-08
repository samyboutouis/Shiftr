import React, {Component} from 'react';
import UserIndex from './user/index'
import ShiftIndex from './shift/index'
import Navbar from './navbar';
import OpenShifts from './shift/open'
import Pool from '../pool.png';

class Home extends Component {
  constructor(props){
    super();
    this.state = {name: "World"}
  }

  render(){
    return(

      <div>
        <Navbar />
        <br/>
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
            </div>
            <p style={{padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>Your Upcoming Shifts</p>
            <ShiftIndex />
          </div>
          {/*right column*/}
          <div className="shift-pool">

            <p style={{textAlign: 'left', padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>
            <img src={Pool} style={{height:'1em', margin: '0 .5em 0 2em'}}/> Shift Pool </p>
            {/*FOR EACH OPEN/PENDING SHIFT IN POOL*/}
            <div>
            <OpenShifts />
            </div>
          </div>
        </div>
        <div style={{clear:'both'}}>
        </div>


        <UserIndex />
      </div>
    )
  }
}


export default Home;
