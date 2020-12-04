import React, {Component} from 'react'
import axios from 'axios';


class ShiftForm extends Component {
  constructor(props){
    super()
    this.state = {start_time: null, end_time: null, status: false}
  }

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if(event.target.type === "checkbox") {
      this.setState({
        [name]: event.target.checked
      });
    }
    else {
      this.setState({
        [name]: value
    }); 
    }
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

   request.then((response) => {
      this.props.getShifts()
      this.props.clearSelectedShift()
    })
    .catch(function (err){  
      console.log(err)
    })
  }



  render(){
    return(
      <form>
        <label>Start Time</label>
        <input name='start_time' type="text" onChange={this.changeHandler} />

        <label>End Time</label>
        <input name='end_time' type="text" onChange={this.changeHandler} />

        <label>Open</label>
        <input name='status' type="checkbox" onChange={this.changeHandler} />

        <input onClick={this.submitForm} type='submit' />
      </form>
    )
  }
}

export default ShiftForm