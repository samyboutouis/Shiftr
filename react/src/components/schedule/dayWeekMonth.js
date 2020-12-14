import React, {Component} from 'react';

class DayWeekMonth extends Component {
  constructor(props){
    super();
    this.state = {currentPage: 'Week'}
  }

  changeCurrentPage = (newPage) => {
    this.props.setNavState(newPage)
  }

  tabBar = () => {
    return(
        <div className="dwm">
          <div className="view">
            <button className="day-week-month active" onClick={this.changeCurrentPage.bind(this, "Day")}>Day</button>
            <button className="day-week-month active" onClick={this.changeCurrentPage.bind(this, "Week")}>Week</button>
            <button className="day-week-month active" onClick={this.changeCurrentPage.bind(this, "Month")}>Month</button>
          </div>
        </div>

    )
  }

  render(){
    return(
      <div>
        {this.tabBar()}
      </div>
    )
  }
}

export default DayWeekMonth



/*import React, { useState } from "react";


const DayWeekMonth = () => {
const[isActive, setActive] = useState("false");
const[isActive2, setActive2] = useState("false");
const[isActive3, setActive3] = useState("false");

const handleToggle = () =>{
  setActive(!isActive);
};

const handleToggle2 = () =>{
  setActive2(!isActive2);
};
const handleToggle3 = () =>{
  setActive3(!isActive3);
};

return (
  <div className="dwm">
    <button  className={isActive ? "day-week-month" : "day-week-month active"} onClick={handleToggle}> Day </button>
    <button  className={isActive2 ? "day-week-month" : "day-week-month active"} onClick={handleToggle2}> Week</button>
    <button  className={isActive3 ? "day-week-month" : "day-week-month active"} onClick={handleToggle3}> Month </button>
  </div>
);
};

export default DayWeekMonth;*/
