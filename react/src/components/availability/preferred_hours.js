import React, {Component} from 'react';
import axios from 'axios';

class PreferredHours extends Component {
  constructor(props){
    super()
    this.state = {hours: null}
  }

  submitForm = (event) => {
    event.preventDefault();
    if(this.state.hours) {
      let form_data = new FormData();
      form_data.append("availability.preferred_hours", this.state.hours);
      axios.get("http://localhost:8080/users/find/" + localStorage.getItem('netid')).then((response) => {
        let id = response.data._id;
        axios.put(
          "http://localhost:8080/users/update/" + id, 
          form_data, 
          { 
            headers: {'content-type': 'multipart/form-data'} 
          }
        ).then((response) => {
          this.props.updateAvailability();
        }).catch(function (err){  
            console.log(err);
        });
      }).catch((error) => {
        console.log(error);
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
        <h4 className="title is-4">Edit Preferred Hours</h4>
        <form>
          <div className="field">
            <label className="label">Hours</label>
            <div className="control">
              <input 
                className="input" 
                type="number"
                min="0"
                name="hours"
                onChange={this.changeHandler}
              />
            </div>
          </div>
          <div className="control">
            <input className="button" onClick={this.submitForm} type='submit' />
          </div>
        </form>
    </div>
    )
  }
}

export default PreferredHours