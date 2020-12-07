import React, {Component} from 'react';

class Shift extends Component {
  constructor(props){
    super()
  }

  convertDate = (date) => {
    return new Date(this.props.shift.start_time).toDateString();
  }

  render(){
      let startTime = this.convertDate(this.props.shift.start_time)
      console.log(startTime)
    return(
     <div>
        <h3>START TIME: {startTime}</h3>
        <p>END TIME:    {this.props.shift.end_time}</p>
        <p>ID:   {this.props.shift._id}</p>
        <p>GROUP:   {this.props.shift.group}</p>
        <p>LOCATION:   {this.props.shift.location}</p>
        <p>SUPERVISOR:  {this.props.shift.supervisor.name}, {this.props.shift.supervisor.netid}</p>
      </div>

    )
  }
}

export default Shift;

// "supervisor":{"name":"Danai","netid":"da129"}}