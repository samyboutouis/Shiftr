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
          <button className="day-week-month" onClick={this.changeCurrentPage.bind(this, "Day")}>Day</button>
          <button className="day-week-month" onClick={this.changeCurrentPage.bind(this, "Week")}>Week</button>
          <button className="day-week-month" onClick={this.changeCurrentPage.bind(this, "Month")}>Month</button>
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
