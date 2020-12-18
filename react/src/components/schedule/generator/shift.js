import React, {Component} from 'react';
import format from "date-fns/format";

class Shift extends Component {
  constructor(props){
    super()
  }

  convertDate = (mongoDate) => {
    let date = new Date(mongoDate * 1000)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  render(){
    return(
     <div>
        {/* <h3>ID:   {this.props.shift._id}</h3>
        <p>Start Time: {this.convertDate(this.props.shift.start_time)}</p>
        <p>End Time:    {this.convertDate(this.props.shift.end_time)}</p> */}
        {/* <p>Name:   {this.props.shift.employee ? this.props.shift.employee.name : "none"}</p> */}
        {/* <p>Rank:   {this.props.shift.employee ? this.props.shift.employee.rank : ""}</p> */}
        {/* <p>Status:   {this.props.shift.status}</p> */}
        <p>{format(this.props.shift.start_time*1000, "HH mm")} - {format(this.props.shift.end_time*1000, "HH mm")}: {this.props.shift.employee ? this.props.shift.employee.name : this.props.shift.status }</p>
        {/* <p>Group:   {this.props.shift.group}</p> */}
        {/* <p>LOCATION:   {this.props.shift.location}</p>
        <p>SUPERVISOR:  {this.props.shift.supervisor.name}, {this.props.shift.supervisor.netid}</p> */}
      </div>

    )
  }
}

export default Shift;