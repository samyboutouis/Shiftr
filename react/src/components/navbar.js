import React, {Component} from 'react';

class Nbar extends Component {
  constructor(props){
    super();
    this.toggleBurger = this.toggleBurger.bind(this);
  }

  changeCurrentPage = (newPage) => {
    this.props.setNavState(newPage)
  }

  toggleBurger = (e) => {
    let classes = 'navbar-burger';
    let els = document.getElementsByClassName('navbar-burger is-active');
    if(els){
      console.log(els);
      while (els[0]) {
        els[0].classList.remove('is-active')
      }
    }
    e.target.className = classes.replace('navbar-burger','navbar-burger is-active');
  }

  userBar = () => {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <p className="logo" onClick={this.changeCurrentPage.bind(this, "Shiftr")}>Shiftr</p>
          <p role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar" onClick={(e) => (this.toggleBurger(e))}>
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
