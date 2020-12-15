import React, {Component} from 'react';
import axios from 'axios';

class AvailabilityForm extends Component {
  constructor(props){
    super()
    this.state = {start_time: null, end_time: null, status: false}
  }

  submitForm = (event) => {
    event.preventDefault();
    let form_data = new FormData();
    let request;
    let url; 

    for (let [key, value] of Object.entries(this.state)) {
      if(value) {form_data.append(key, value)};
    }

    if(this.props.reqType === "create"){
      url = "http://localhost:8080/shifts" 
      request =  axios.post(url, form_data, {
        headers: {'content-type': 'multipart/form-data'}
      })
    }else{
      url = "http://localhost:8080/shifts/update/" + this.props.shift.start_time
      request =  axios.put(url, form_data, {
        headers: {'content-type': 'multipart/form-data'}
      })
    }
  }
    
  render(){
    return(
      
      <form class = "form">
        <div class = "ml-5 mt-5" >
        <label>Start Time </label>
        <input name='start_time' type="text" placeholder="Enter time" onChange={this.changeHandler} />
        </div>
        
        <div class = "ml-5" >
        <label>End Time </label>
        <input name='end_time' type="text" placeholder="Enter time" onChange={this.changeHandler} />
        </div>
        <input onClick={this.submitForm} type='submit' class = "ml-5"/>
      </form>
  
    )
  }
}


export default AvailabilityForm

