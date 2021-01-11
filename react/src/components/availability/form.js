import React, {Component} from 'react';
import axios from 'axios';

class AvailabilityForm extends Component {
  constructor(props){
    super()
    this.state = {day: "", start_time: null, end_time: null} // location: null, preference: null
  }

  submitForm = (event) => {
    event.preventDefault();
    alert("You have submitted your availability for " + this.state.day + ": " + this.state.start_time + "-" + this.state.end_time);
    let form_data = new FormData();
    let request;
    let url; 

    for (let [key, value] of Object.entries(this.state)) {
      if(value) {form_data.append(key, value)};
    }

    // for testing, change the id to an object id in your own database
    url = "http://localhost:8080/users/add_availability/5ff77f271ac8c8017476b008" //change later ?? make sure in database when u test
    request =  axios.put(url, form_data, {
    headers: {'content-type': 'multipart/form-data'}
      })
    
  }
   
  changeHandler = (event) => {
    const name = event.target.name;
    console.log(name);
    const value = event.target.value;
    this.setState({
        [name]: value
    }); 
    console.log(this.state.value);
  }
  
  

  render(){
    return(
      <form className = "field">
        <div className = "ml-5 mt-2"> 
        <label className = "label">Day </label>
        <select name = 'day' value = {this.state.day} onChange ={this.changeHandler}>
          <option value = "Monday">Monday</option>
          <option value = "Tuesday">Tuesday</option>
          <option value = "Wednesday">Wednesday</option>
          <option value = "Thursday">Thursday</option>
          <option value = "Friday">Friday</option>
          <option value = "Saturday">Saturday</option>
          <option value = "Sunday">Sunday</option>
        </select>
        </div>

        <div className = "ml-5 mt-2" >
        <label className = "label">Start Time </label>
        <input name='start_time' type="text" placeholder="Enter time" onChange={this.changeHandler} />
        </div>
        
        <div className = "ml-5 mt-2" >
        <label className = "label">End Time </label>
        <input name='end_time' type="text" placeholder="Enter time" onChange={this.changeHandler} />
        </div>
    {/* 
        <div className = "ml-5"> 
        <label>Location </label>
        <select name = 'location' value = {this.state.location} onChange ={this.changeHandler}>
          <option value = "Lilly Library">Lilly Library</option>
          <option value = "The Link">The Link</option>
          <option value = "Co-Lab">The Co-Lab</option>
          <option value = "East Printers">East Printers</option>
          <option value = "Central Printers">Central Printers</option>
          <option value = "West Printers">West Printers</option>
          <option value = "Perkins Library">Perkins Library</option>
        </select>
        </div>
        
        <div className = "ml-5"> 
        <label>Preference </label>
        <select name = 'preference' value = {this.state.preference} onChange ={this.changeHandler}> 
          <option value = "Most Preferred">Most Preferred</option>
          <option value = "Somewhat Preferred">Somewhat Preferred</option>
          <option value = "Least Preferred">Least Preferred</option>
          <option value = "Unavailable">Unavailable</option>
        </select>
        </div>
        */}
        <div className = "mt-2">
        <input onClick={this.submitForm} type='submit' class = "button ml-5"/>
        </div>
      </form>
  
    )
  }
}

export default AvailabilityForm
