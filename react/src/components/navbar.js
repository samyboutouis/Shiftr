import React, {Component} from 'react';

class Nbar extends Component {
  constructor(props){
    super(props);
    this.toggleClass= this.toggleClass.bind(this);
    this.state = {active: false};
  }

  changeCurrentPage = (newPage) => {
    this.props.setNavState(newPage)
  }

  toggleClass() {
    const currentState = this.state.active;
    this.setState({active: !currentState});
  };

  userBar = () => {
    let third = null;
    if(localStorage.getItem('role')==='employee'){
      third = "Availability";
    } else if(localStorage.getItem('role')==='supervisor' || localStorage.getItem('role')==='admin'){
      third = "Employees"
    }
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <p className="logo" onClick={this.changeCurrentPage.bind(this, "Shiftr")}>Shiftr</p>
          <div role="button" className={this.state.active ? 'navbar-burger is-active': 'navbar-burger'} onClick={this.toggleClass} aria-label="menu" aria-expanded="false" data-target="navbar">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </div>
        </div>
        <div id="navbar" className={this.state.active ? 'navbar-menu is-active': 'navbar-menu'} onClick={this.toggleClass}>
          <div className="navbar-end">
            <div className="navbar-item nav-link" onClick={this.changeCurrentPage.bind(this, "Home")} >
              Home
            </div>
            <div className="navbar-item nav-link" onClick={this.changeCurrentPage.bind(this, "Schedule")} >
              Schedule
            </div>
            <div className="navbar-item nav-link" onClick={this.changeCurrentPage.bind(this, third)}  >
              {third}
            </div>
            <div className="navbar-item nav-link" onClick={this.changeCurrentPage.bind(this, "Hours")} >
              Hours
            </div>
            <div className="navbar-item nav-link" onClick={this.props.logout} >
              Logout
            </div>
          </div>
        </div>
      </nav>
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
