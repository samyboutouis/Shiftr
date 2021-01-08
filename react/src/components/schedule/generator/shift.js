import React, {Component} from 'react';
import format from "date-fns/format";
import differenceInMinutes from "date-fns/differenceInMinutes"

class Shift extends Component {
  constructor(props){
    super()
  }

  convertDate = (mongoDate) => {
    let date = new Date(mongoDate * 1000)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  shiftTime = () => {
    var start = this.props.shift.start_time*1000
    var end = this.props.shift.end_time*1000
    if(differenceInMinutes(end, start) > 30) {
      return  <div className="scheduled-shift" >
        <h4>{format(start, "h:mm")} - {format(end, "h:mm")}</h4>
        <p> {this.props.shift.employee ? this.props.shift.employee.name : "unassigned" } @ {this.props.group} </p>
      </div>
    } else {
      return <div className="scheduled-shift" >
      <p>
        <span>
          {format(start, "h:mm")} - {format(end, "h:mm")}
        </span>
        &nbsp;
        {this.props.shift.employee ? this.props.shift.employee.name : "unassigned" } </p>
        {/* <button className='build-schedule-button' >Edit Shift </button> */}
    </div>
    }
  }

  render(){
    return(<div>
     {this.shiftTime()}
     </div>
    )
  }
}

export default Shift;