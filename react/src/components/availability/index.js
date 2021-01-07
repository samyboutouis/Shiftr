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
                    <th>Sunday</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                </tr>
            </thead>
            <tbody>
                <tr className = "time"> 
                <td></td> 
                <td></td> 
                <td></td> 
                <td></td> 
                <td></td> 
                <td></td> 
                <td></td> 
                </tr>
            </tbody>
        </table>
        <div className = "ml-5">Location: </div>
        <Key groups={[
            {group: 'The Link', color: Constants.RED},
            {group: 'Lilly Library', color: Constants.PINK},
            {group: 'Co-Lab', color: Constants.DARKBLUE},
            {group: 'East Printers', color: Constants.PEACH},
            {group: 'Central Printers', color: Constants.LIGHTBLUE},
            {group: 'West Printers', color: Constants.DARKPURPLE},
            {group: 'Perkins Library', color: Constants.LIGHTPURPLE}]}/>
        <div className = "ml-5">Preference: </div>
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
