import React, {Component} from 'react'
import axios from 'axios';

class BuildSchedule extends Component {
  constructor(props){
    super()
    this.state = {group: null, data: null}
  }

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
        [name]: value
    }); 
  }

  submitForm = (event) => {
    event.preventDefault();
    axios.put("http://localhost:8080/schedule/assign_shifts/" + this.state.group).then((response) => {
        this.props.toggleBuildSchedule(response.data)
    }).catch(function (err){  
        console.log(err)
    });
  }

  render(){
    return(
    <div className="tile is-vertical ml-4">
        <h4 className="tile title is-4">Generate a Schedule</h4>
        <form className="tile is-vertical is-4">
          <div className="field">
            <label className="label">Group</label>
            <div className="control">
              <input className='input is-small' name='group' type="text" placeholder="e.g CoLab" onChange={this.changeHandler} />
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

export default BuildSchedule