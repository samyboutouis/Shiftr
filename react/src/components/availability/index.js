import React, {Component} from 'react';
import Key from './Key'
import * as Constants from '../../constants'
import AvailabilityForm from './form'


class AvailabilityIndex extends Component {
  constructor(props){
    super();
  }
  mapTimes = () => {
    let times = [];

      for(let i = 0; i < 7; i++){
          times.push(<td></td>);
      }

    return times
    
   
    //fix this so that it at least displays empty cal to be filled 
    //change color based on availability 
  }
  drawCalendar = () => {
    return <div>
      <div className= "days-of-week availability-table">
        <table className = "table is-bordered is-fullwidth">
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
            <tr>{this.mapTimes()}</tr>
            <tr>{this.mapTimes()}</tr>
            

  
            </tbody>
        </table>
        </div>
        {/*
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
            */}
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
