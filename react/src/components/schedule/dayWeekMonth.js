import React, {Component} from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

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
          <ToggleButtonGroup className="view" type="radio" name="options" defaultValue={2}>
            <ToggleButton value={1} className="day-week-month" onClick={this.changeCurrentPage.bind(this, "Day")}>Day</ToggleButton>
            <ToggleButton value={2} className="day-week-month" onClick={this.changeCurrentPage.bind(this, "Week")}>Week</ToggleButton>
            <ToggleButton value={3} className="day-week-month" onClick={this.changeCurrentPage.bind(this, "Month")}>Month</ToggleButton>
          </ToggleButtonGroup>
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
