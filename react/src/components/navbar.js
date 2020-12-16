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
    this.setState({ active: !currentState });
  };

  userBar = () => {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <p className="logo" onClick={this.changeCurrentPage.bind(this, "Shiftr")}>Shiftr</p>
          <a role="button" className={this.state.active ? 'navbar-burger is-active': 'navbar-burger'} onClick={this.toggleClass} aria-label="menu" aria-expanded="false" data-target="navbar">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div id="navbar" className={this.state.active ? 'navbar-menu is-active': 'navbar-menu'} onClick={this.toggleClass}>
          <div className="navbar-end">
            <a className="navbar-item" onClick={this.changeCurrentPage.bind(this, "Home")} href="#top">
              Home
            </a>
            <a className="navbar-item" onClick={this.changeCurrentPage.bind(this, "Schedule")} href="#top">
              Schedule
            </a>
            <a className="navbar-item" onClick={this.changeCurrentPage.bind(this, "Availability")} href="#top">
              Availability
            </a>
            <a className="navbar-item" onClick={this.changeCurrentPage.bind(this, "Hours")} href="#top">
              Hours
            </a>
            <a className="navbar-item" onClick={this.props.logout} href="#top">
              Logout
            </a>
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
