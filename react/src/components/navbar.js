import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

class Nbar extends Component {
  constructor(props){
    super()
    this.state = { currentPage: 'Home'}
  }

  changeCurrentPage = (newPage) => {
    this.props.setNavState(newPage)
  }

  userBar = () => {
    {/*if(this.state.users && !this.state.selectedUser){... need to make this happen if person is user vs supervisor vs admin*/}
    return (
    <Navbar expand="lg">
      <Navbar.Brand className="logo" onClick={this.changeCurrentPage.bind(this, "Shiftr")}>Shiftr</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="ml-auto">
        <Nav.Link onClick={this.changeCurrentPage.bind(this, "Home")}>Home</Nav.Link>
        <Nav.Link onClick={this.changeCurrentPage.bind(this, "Schedule")}>Schedule</Nav.Link>
        <Nav.Link onClick={this.changeCurrentPage.bind(this, "Availability")}>Availability</Nav.Link>
        <Nav.Link onClick={this.changeCurrentPage.bind(this, "Hours")}>Hours</Nav.Link>
      </Nav>
      </Navbar.Collapse>
    </Navbar>
    );
  }

  render(){
    return(
      <div>
        {this.userBar()}
      </div>
    )
  }
}

export default Nbar;
