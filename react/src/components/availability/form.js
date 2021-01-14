import React, {Component} from 'react';
import axios from 'axios';
import toDate from 'date-fns/toDate'
import getUnixTime from 'date-fns/getUnixTime'

class AvailabilityForm extends Component {
  constructor(props){
    super()
    this.state = {day: null, start_time: null, end_time: null} // location: null, preference: null
  }

  submitForm = (event) => {
    event.preventDefault();
    if(this.state.day && this.state.start_time && this.state.end_time) {
      var date_parts = this.state.day.split("-")
      var start_parts = this.state.start_time.split(":")
      var end_parts = this.state.end_time.split(":")
      var start = toDate(new Date(date_parts[0], date_parts[1]-1, date_parts[2], start_parts[0], start_parts[1], 0))
      var end = toDate(new Date(date_parts[0], date_parts[1]-1, date_parts[2], end_parts[0], end_parts[1], 0))

      let form_data = new FormData();
      form_data.append("start_time", getUnixTime(start))
      form_data.append("end_time", getUnixTime(end))

      axios.put(
        "http://localhost:8080/users/add_availability", 
        form_data, 
        { 
          headers: {'content-type': 'multipart/form-data'} 
        }
      ).then((response) => {
        this.props.updateAvailability();
      }).catch(function (err){  
        console.log(err)
      });
    } else {
      alert("Please complete the form.")
    }
  }
   
  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    }); 
  }
  
  
  render(){
    return(
      <div className="mt-5">
        <h4 className="title is-4">Add Availability</h4>
        <form>
        <div className="field">
            <label className="label">Date</label>
            <div className="control">
              <input 
                className="input" 
                type="date" 
                name="day"
                onChange={this.changeHandler}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Start Time</label>
            <div className="control">
              <input 
                className="input" 
                type="time" 
                name="start_time"
                onChange={this.changeHandler} 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">End Time</label>
            <div className="control">
              <input 
                className="input" 
                type="time" 
                name="end_time"
                onChange={this.changeHandler}
              />
            </div>
          </div>

          <div className="control">
            <input className="button" onClick={this.submitForm} type='submit' />
          </div>
        </form>

    </div>
    //   <form className = "field">
    //     <div className = "ml-5 mt-2"> 
    //     <label className = "label">Day </label>
    //     <select name = 'day' value = {this.state.day} onChange ={this.changeHandler}>
    //       <option value = "Monday">Monday</option>
    //       <option value = "Tuesday">Tuesday</option>
    //       <option value = "Wednesday">Wednesday</option>
    //       <option value = "Thursday">Thursday</option>
    //       <option value = "Friday">Friday</option>
    //       <option value = "Saturday">Saturday</option>
    //       <option value = "Sunday">Sunday</option>
    //     </select>
    //     </div>

    //     <div className = "ml-5 mt-2" >
    //     <label className = "label">Start Time </label>
    //     <input name='start_time' type="text" placeholder="Enter time" onChange={this.changeHandler} />
    //     </div>
        
    //     <div className = "ml-5 mt-2" >
    //     <label className = "label">End Time </label>
    //     <input name='end_time' type="text" placeholder="Enter time" onChange={this.changeHandler} />
    //     </div>
    // {/* 
    //     <div className = "ml-5"> 
    //     <label>Location </label>
    //     <select name = 'location' value = {this.state.location} onChange ={this.changeHandler}>
    //       <option value = "Lilly Library">Lilly Library</option>
    //       <option value = "The Link">The Link</option>
    //       <option value = "Co-Lab">The Co-Lab</option>
    //       <option value = "East Printers">East Printers</option>
    //       <option value = "Central Printers">Central Printers</option>
    //       <option value = "West Printers">West Printers</option>
    //       <option value = "Perkins Library">Perkins Library</option>
    //     </select>
    //     </div>
        
    //     <div className = "ml-5"> 
    //     <label>Preference </label>
    //     <select name = 'preference' value = {this.state.preference} onChange ={this.changeHandler}> 
    //       <option value = "Most Preferred">Most Preferred</option>
    //       <option value = "Somewhat Preferred">Somewhat Preferred</option>
    //       <option value = "Least Preferred">Least Preferred</option>
    //       <option value = "Unavailable">Unavailable</option>
    //     </select>
    //     </div>
    //     */}
    //     <div className = "mt-2">
    //     <input onClick={this.submitForm} type='submit' class = "button ml-5"/>
    //     </div>
    //   </form>
  
    )
  }
}

export default AvailabilityForm
