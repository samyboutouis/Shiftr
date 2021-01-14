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
      return  this.longShiftDetails(start, end)
    } else {
      return this.shortShiftDetails(start, end)
    }
  }

  shortShiftDetails(start, end) {
    if(this.props.shift.overlap) {
      return <p className="short-overlap">{this.props.shift.employee ? this.props.shift.employee.name : "unassigned"}</p>
    }
    else {
      return <div className="scheduled-shift pt-0">
      <p>
        <span className="bold">
          {format(start, "h:mm")} - {format(end, "h:mm")}
        </span>
        &nbsp;
        {this.props.shift.employee ? this.props.shift.employee.name : "unassigned"} </p>
    </div>
    }
  }

  longShiftDetails(start, end) {
    if(this.props.shift.overlap && this.props.shift.overlap.count>2) {
      if(differenceInMinutes(end, start) <= 60  || this.props.shift.overlap.count>3) {
        return <div className="overlap">
        <p> {this.props.shift.employee ? this.props.shift.employee.netid : "none"} </p>
      </div>
      }
      else {
        return <div className="overlap">
        <h4 className="bold">
          {this.formatShortDate(start)}&#8211;{this.formatShortDate(end)}</h4>
        <p> {this.props.shift.employee ? this.props.shift.employee.netid : "none"} </p>
      </div>
      }
    }
    else {
      return <div className="scheduled-shift">
        <h4 className="bold">{format(start, "h:mm")}&#8211;{format(end, "h:mm")}</h4>
        <p> {this.props.shift.employee ? this.props.shift.employee.name : "unassigned"} @{this.props.group} </p>
      </div>
    }
  }

  formatShortDate(date) {
    if(format(date, "m")==="0") {
      return format(date, "h")
    }
    else {
      return format(date, "h:mm")
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