import React, {Component} from 'react'
import axios from 'axios';
import 'bulma-calendar/dist/css/bulma-calendar.min.css';
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';
import lastDayOfWeek from "date-fns/lastDayOfWeek";
import getUnixTime from 'date-fns/getUnixTime'

class BuildSchedule extends Component {
  constructor(props){
    super()
    this.state = {group: null, modal: true, data: null, start_date: null, end_date: null}
    window.scrollTo(0,0)
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
    let url = "http://localhost:8080/schedule/assign_shifts/" + this.state.group + '/' + this.state.start_date + '/' + this.state.end_date
    axios.put(url).then((response) => {
        console.log(response.data)
        this.props.toggleBuildSchedule(response.data)
    }).catch(function (err){  
        console.log(err)
    });
  }

  dateHandler = (date) => {
    this.setState({start_date: getUnixTime(date.data.datePicker._date.start), end_date: getUnixTime(date.data.datePicker._date.end)})
    console.log(this.state.start_date)
    console.log(this.state.end_date)
  }

  componentDidMount() {
    var start = lastDayOfWeek(new Date(), { weekStartsOn: 1 })
    var end = lastDayOfWeek(start)
    var calendars = bulmaCalendar.attach('[type="date"]', {isRange: true, labelFrom: 'Start', labelTo: 'End', startDate: start, endDate: end});
    for(var i = 0; i < calendars.length; i++) {
      calendars[i].on('select', date => {
        this.dateHandler(date);
      });
    }
  }

  groupOptions = () => {
    var groups = localStorage.getItem('group').split(",")
    var options = []
    groups.forEach((group) =>
      options.push(
        <option className="capitalize-me" value={group}>{group}</option>
      )
    )
    return options
  }

  render(){
    return(
    <div className="tile is-vertical mt-5 ml-4">
        <h4 className="tile title is-4">Generate a Schedule</h4>
        <form className="tile is-vertical is-4">

          <div className="field">
              <label className="label">Group</label>
              <div className="control">
                <div className="select" onChange={this.changeHandler}>
                  <select defaultValue="select_a_group" name="group">
                    <option disabled="disabled" value="select_a_group" hidden="hidden">Select a Group</option>
                    {this.groupOptions()}
                  </select>
                </div>
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