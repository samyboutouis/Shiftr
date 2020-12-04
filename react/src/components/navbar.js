import React, {Component} from 'react';
class Navbar extends Component {
  constructor(props){
    super()
  }



  adminBar = () => {
    //if(this.state.users && !this.state.selectedUser){ need to make this happen if user is admin
      return (<div>
          <ul id="nav">

            <li><a href="javascript:void(0)">Hours</a></li>
            <li><a href="javascript:void(0)">Availability</a></li>
            <li><a href="javascript:void(0)">Schedule</a></li>
            <li><a href="javascript:void(0)">Home</a></li>
            <li className="logo"> <a href="javascript:void(0)">Shiftr</a> </li>
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
