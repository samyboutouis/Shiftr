import React, {Component} from 'react';

class Nbar extends Component {
  constructor(props){
    super()
    this.state = { currentPage: 'Home'}
  }

  changeCurrentPage = (newPage) => {
    this.props.setNavState(newPage)
  }

  userBar = () => {
    return (
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <p className="logo" onClick={this.changeCurrentPage.bind(this, "Shiftr")}>Shiftr</p>
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div id="navbar" class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item">
              <p onClick={this.changeCurrentPage.bind(this, "Home")}>Home</p>
            </div>
            <div class="navbar-item">
              <p onClick={this.changeCurrentPage.bind(this, "Schedule")}>Schedule</p>
            </div>
            <div class="navbar-item">
              <p onClick={this.changeCurrentPage.bind(this, "Availability")}>Availability</p>
            </div>
            <div class="navbar-item">
              <p onClick={this.changeCurrentPage.bind(this, "Hours")}>Hours</p>
            </div>
          </div>
        </div>
      </nav>
    // <Navbar expand="lg">
    //   <Navbar.Brand className="logo" onClick={this.changeCurrentPage.bind(this, "Shiftr")}>Shiftr</Navbar.Brand>
    //   <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    //   <Navbar.Collapse id="responsive-navbar-nav">
    //   <Nav className="ml-auto">
    //     <Nav.Link onClick={this.changeCurrentPage.bind(this, "Home")}>Home</Nav.Link>
    //     <Nav.Link onClick={this.changeCurrentPage.bind(this, "Schedule")}>Schedule</Nav.Link>
    //     <Nav.Link onClick={this.changeCurrentPage.bind(this, "Availability")}>Availability</Nav.Link>
    //     <Nav.Link onClick={this.changeCurrentPage.bind(this, "Hours")}>Hours</Nav.Link>
    //   </Nav>
    //   </Navbar.Collapse>
    // </Navbar>
    );
  }

  render(){
    return(
      <div>
        {this.userBar()}
      </div>
    );
  }
}

export default Nbar;
