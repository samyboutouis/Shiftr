import React, {Component} from 'react';
import axios from 'axios';
import Key from './Key'
import * as Constants from '../../constants'
import AvailabilityForm from './form'


class AvailabilityIndex extends Component {
  constructor(props){
    super();
  }
  getTimes = () => {
    let self = this;
    axios.get("http://localhost:8080/users/add_availability/").then( (response) => { //need to change this 
          self.setState({data: response.data})
       }).catch( (error) => {
          console.log(error)
       });
    }

  mapTimes = () => {
    return this.state.data.user.map((user,index) =>
          <tr key={index}>
              <td>hello there</td>
              <td> {user.start_time}</td>
              <td> {user.end_time}</td>
          </tr>
        )
    }
    
   
    //fix this so that it at least displays empty cal to be filled 
    //change color based on availability 
  
  drawCalendar = () => {
    if(this.props.data){
      return <div className= "days-of-week availability-table">
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
            {this.mapTimes()}
            </tbody>
        </table>
        </div>
    }
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
}
  render(){
    return(
        <div>
          <div>
            <AvailabilityForm  />
      </div>
          {this.drawCalendar()}
        </div>
    )
  }

}
export default AvailabilityIndex
