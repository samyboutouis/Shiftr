import React, {Component} from 'react';
class Navbar extends Component {
  constructor(props){
    super()
    this.state = { currentPage: 'Home'}
  }

  changeCurrentPage = (newPage) => {
    this.props.setNavState(newPage)
  }

  userBar = () => {
    {/*if(this.state.users && !this.state.selectedUser){... need to make this happen if person is user vs supervisor vs admin*/}
      return (<div>
          <ul id="nav">
            <li onClick={this.changeCurrentPage.bind(this, "Hours")}>Hours</li>
            <li onClick={this.changeCurrentPage.bind(this, "Availability")}>Availability</li>
            <li onClick={this.changeCurrentPage.bind(this, "Schedule")}>Schedule</li>
            <li onClick={this.changeCurrentPage.bind(this, "Home")}>Home</li>
            <li className="logo" onClick={this.changeCurrentPage.bind(this, "Shiftr")}>Shiftr</li>
          </ul>
        </div>)
  }

  render(){
    return(
      <div>
        {this.userBar()}
      </div>
    )
  }
}

export default Navbar;
