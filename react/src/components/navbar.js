import React, {Component} from 'react';

import axios from 'axios';

class Navbar extends Component {
  constructor(props){
    super()
  }



  adminBar = () => {
    //if(this.state.users && !this.state.selectedUser){ need to make this happen if user is admin
      return (<div>
          <ul id="nav">

            <li><a href="#">Hours</a></li>
            <li><a href="#">Availability</a></li>
            <li><a href="#">Schedule</a></li>
            <li><a href="#">Home</a></li>
            <li className="logo"> <a href="#">Shiftr</a> </li>
          </ul>
        </div>)
    
  }

  render(){
    return(
      <div>
        {this.adminBar()}
      </div>
    )
  }
}

export default Navbar;
