import React, {Component} from 'react';
import Key from './Key'
import * as Constants from '../../constants'
import AvailabilityForm from './form'

class AvailabilityIndex extends Component {
  constructor(props){
    super();
  }

  drawCalendar = () => {
    return <div>
        <table className="days-of-week">
            <thead>
                <tr className="week">
                    <th className="day">Sunday</th>
                    <th className="day">Monday</th>
                    <th className="day">Tuesday</th>
                    <th className="day">Wednesday</th>
                    <th className="day">Thursday</th>
                    <th className="day">Friday</th>
                    <th className="day">Saturday</th>
                </tr>
            </thead>
            <tbody>
                <tr className = "time"> 
                    <td className = "day"> </td>
                    <td className = "day"> </td>
                    <td className = "day"> </td>
                    <td className = "day"> </td>
                    <td className = "day"> </td>
                    <td className = "day"> </td>
                    <td className = "day"> </td>
                </tr>
            </tbody>
        </table>
        <div class = "ml-5">Location: </div>
        <Key groups={[
            {group: 'The Link', color: Constants.RED},
            {group: 'Lilly Library', color: Constants.PINK},
            {group: 'Co-Lab', color: Constants.DARKBLUE},
            {group: 'East Printers', color: Constants.PEACH},
            {group: 'Central Printers', color: Constants.LIGHTBLUE},
            {group: 'West Printers', color: Constants.DARKPURPLE},
            {group: 'Perkins Library', color: Constants.LIGHTPURPLE}]}/>
        <div class = "ml-5">Preference: </div>
        <Key groups={[
            {group: 'Most Preferred', color: Constants.GREEN},
            {group: 'Somewhat Preferred', color: Constants.YELLOW},
            {group: 'Least Preferred', color: Constants.LIGHTORANGE},
            {group: 'Unavailable', color: Constants.DARKRED}]}/>
        <AvailabilityForm />
    </div>

    
  }

  render(){
    return(
        <div>
          {this.drawCalendar()}
        </div>
    )
  }
}


export default AvailabilityIndex
