import React, {Component} from 'react';
import UserIndex from './user/index'
import ShiftIndex from './shift/index'
import Navbar from './navbar';

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
          </div>
        </div>
        <div style={{clear:'both'}}>
        </div>
        {/*end two column section*/}


        <UserIndex />
        <ShiftIndex />
      </div>
    )
  }
}


export default Home;
