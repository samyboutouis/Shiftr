import React, {Component} from 'react'
import axios from 'axios';
import 'bulma-calendar/dist/css/bulma-calendar.min.css'
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';

class BuildSchedule extends Component {
  constructor(props){
    super()
    this.state = {group: null, data: null, start_date: null, end_date: null}
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

  dateHandler = (date) => {
    this.setState({start_date: date.data.datePicker._date.start, end_date: date.data.datePicker._date.end})
  }

  componentDidMount() {
    var calendars = bulmaCalendar.attach('[type="date"]', {isRange: true, labelFrom: 'Start', labelTo: 'End'});
    for(var i = 0; i < calendars.length; i++) {
      calendars[i].on('select', date => {
        this.dateHandler(date);
      });
    }
  }

  render(){
    return(
    <div className="tile is-vertical ml-4">
        <h4 className="tile title is-4">Generate a Schedule</h4>
        <form className="tile is-vertical is-4">

          <div className="field">
            <label className="label">Group</label>
            <div className="control">
              <input className='input' name='group' type="text" placeholder="e.g CoLab" onChange={this.changeHandler} />
            </div>
          </div>

          <div className="field">
            <label className="label">Time Range</label>
            <div className="control">
              <input type="date"/>
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