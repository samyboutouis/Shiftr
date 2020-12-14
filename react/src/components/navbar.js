import React, {Component} from 'react';

class Nbar extends Component {
  constructor(props){
    super(props);
    this.toggleBurger= this.toggleBurger.bind(this);
    this.state = {active: false};
  }

  changeCurrentPage = (newPage) => {
    this.props.setNavState(newPage)
  }

  toggleBurger() {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };

  userBar = () => {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <p className="logo" onClick={this.changeCurrentPage.bind(this, "Shiftr")}>Shiftr</p>
          <p role="button" className={this.state.active ? 'navbar-burger is-active': 'navbar-burger'} onClick={this.toggleBurger} aria-label="menu" aria-expanded="false" data-target="navbar">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </p>
        </div>
        <div id="navbar" className="navbar-menu">
          <div className="mavbar-start"></div>
          <div className="navbar-end">
            <a className="navbar-item" onClick={this.changeCurrentPage.bind(this, "Home")} href="#">
              Home
            </a>
            <a className="navbar-item" onClick={this.changeCurrentPage.bind(this, "Schedule")} href="#">
              Schedule
            </a>
            <a className="navbar-item" onClick={this.changeCurrentPage.bind(this, "Availability")} href="#">
              Availability
            </a>
            <a className="navbar-item" onClick={this.changeCurrentPage.bind(this, "Hours")} href="#">
              Hours
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
