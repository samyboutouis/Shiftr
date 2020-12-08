import React, {Component} from 'react';

class DayWeekMonth extends Component {

  render(){
    return(
        <div>
          <table className="day-week-month">
            <thead>
                <tr className="view">
                    <th className="gradient">Day</th>
                    <th className="dark-gradient">Week</th>
                    <th className="gradient">Month</th>
                </tr>
            </thead>
        </table>
    </div>
    )
  }
}

export default DayWeekMonth
