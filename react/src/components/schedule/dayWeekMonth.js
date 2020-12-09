import React, {Component} from 'react';

class DayWeekMonth extends Component {
  constructor(props){
    super();
    this.state = {name: "World", navState: "Week"}
  }

  changeCurrentPage = (newPage) => {
    if (this.props.setNavState){
    this.props.setNavState(newPage)
  }
  }

  setNavState = (newPage) => {
    this.setState({navState: newPage})
  }


  showHome = () => {
    if (this.state.navState === "Week"){
      console.log("week")
      return <div>
          <p> sighs </p>
        </div>
    }else if(this.state.navState === "Day"){
      return <div>
          <p> sighs </p>
        </div>
    }else if(this.state.navState === "Month"){
      return <div>
          <p> sighs </p>
        </div>
    }
  }


  render(){
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
}

export default DayWeekMonth
