import React, {Component} from 'react';
import axios from 'axios';

class CreateSchedule extends Component {
  constructor(props){
    super();
    this.state= {data: false }
  }

  componentDidMount = () => {
    this.getShifts()
  }

  convertDate = (mongoDate) => {
    let date = new Date(mongoDate * 1000)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  //TODO: get shifts for specific user
  getShifts = () => {
    let self = this;
    console.log('making web call');
    axios.get("http://localhost:8080/schedule/all_matches/Code+").then( (response) => {
      self.setState({data: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  drawShifts = () => {
    if(this.state.data){
        console.log(this.state.data)
      let data = this.state.data
      return data.map((shift,index) =>
        <div key={index}>
            <h1>{shift.name}</h1>
            <h3>Availability</h3>
            <p>START TIME: {this.convertDate(shift.availability.times.start_time)}</p>
            <p>END TIME:    {this.convertDate(shift.availability.times.end_time)}</p>
            {shift.matching_shifts.map((s,i) => <div key={i}><h3>Shift:</h3><p>START TIME: {this.convertDate(s.start_time)}</p><p>END TIME:    {this.convertDate(s.end_time)}</p></div>) }
        </div>
      )
    }
  }

  render(){
    return(
        <div>
            {this.drawShifts()}
        </div>
    )
  }
}


export default CreateSchedule
