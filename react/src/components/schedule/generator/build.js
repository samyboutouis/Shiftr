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
    <div>
        <form>
            <label>Group</label>
            <input name='group' type="text" onChange={this.changeHandler} />
            <input onClick={this.submitForm} type='submit' />
        </form>

    </div>
    )
  }
}

export default BuildSchedule