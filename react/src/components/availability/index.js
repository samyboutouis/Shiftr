import React, {Component} from 'react';
import axios from 'axios';
import format from 'date-fns/format'
import AvailabilityForm from './form'
import PreferredHours from './preferred_hours';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrash } from '@fortawesome/free-solid-svg-icons';

class AvailabilityIndex extends Component {
  constructor(props){
    super(props);
    this.state={data:null}
  }

  componentDidMount() {
    this.getTimes()
  }

  getTimes = () => {
    let self = this;
    axios.get("http://localhost:8080/users/get_availability/").then( (response) => { //need to change this 
      self.setState({data: response.data});
    }).catch( (error) => {
      console.log(error)
    });
  }

  drawTimes = () => {
    if(this.state.data){
      return (
        <div className="message my-5">
          <div className="message-header">
              <p>All Availability</p>
              <p>Preferred Hours:   {this.state.data.availability ? this.state.data.availability.preferred_hours : 'Unknown' }</p>
          </div>
          <div className="message-body">
            <table className = "table is-bordered is-striped is-full-width">
              <thead> 
                <tr>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead> 
              <tbody>
                {this.mapTimes()}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
  
  mapTimes = () => {
    if(this.state.data.availability){
      return this.state.data.availability.times.map((avail,index) =>
        <tr key={index}>
          <td> {format(avail.start_time*1000, "M/d/y")}</td>
          <td> {format(avail.start_time*1000, "h:mm a")}</td>
          <td> {format(avail.end_time*1000, "h:mm a")}<FontAwesomeIcon icon={faTrash} onClick={this.deleteTime.bind(this, avail)} className="trash"/></td>
        </tr>
      );
    }
  }

  deleteTime = (time) => {
    if(window.confirm('Are you sure you want to delete this availability?')){
      console.log(time.start_time);
      console.log(time.end_time);
      axios.put("http://localhost:8080/users/delete_availability/" + time.start_time + "/" + time.end_time).then((response) => {
        console.log(response);
        this.getTimes();
      }).catch((error) => {
        console.log(error);
      });
    }
  }
   
    //fix this so that it at least displays empty cal to be filled 
    //change color based on availability 
  
  drawCalendar = () => {
    if(this.props.data){
      return (
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
              {this.mapTimes()}
            </tbody>
          </table>
        </div>
      );
        /*
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
            */
    }
  }
  render(){
    return(
      <div className="container">
        <h1 className="title my-5">Availability</h1>
        <div className="side-by-side">
          <div className="left-child">
            <AvailabilityForm  updateAvailability={this.getTimes}/>
            <PreferredHours updateAvailability={this.getTimes}/>
          </div>
          <div className="right-child">
            {this.drawTimes()}
          </div>
        </div>
      </div>
    );
  }

}
export default AvailabilityIndex
