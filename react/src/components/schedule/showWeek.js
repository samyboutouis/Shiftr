import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import getUnixTime from "date-fns/getUnixTime"
import getHours from "date-fns/getHours"
import getMinutes from "date-fns/getMinutes"
import parse from "date-fns/parse"
import differenceInMinutes from "date-fns/differenceInMinutes"

class ShowWeek extends Component {
  constructor(props){
    super()
    this.state= {shifts: false}
    this.setLengths=this.setLengths.bind(this);
  }

  componentDidMount = () => {
    this.getShifts()
  }


  getShifts = (props) => {

    let self = this
    const aformat = ("MM dd yyyy")
    const atimestart = format(this.props.day, aformat)
    const atimeend = format(this.props.day, aformat)
    const start = getUnixTime(parse(atimestart + " "+ this.props.hour, "MM dd yyyy H", new Date()))
    const end = getUnixTime(parse(atimeend + " "+ this.props.hour + " 59", "MM dd yyyy H mm", new Date()))
    axios.get("http://localhost:8080/shifts/find_start/" + start + "/" + end).then( (response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  drawShifts = () => {
    if(this.state.shifts){
      return <div>
        {this.mapShifts()}
      </div>
    }
  }


  setLengths = (e, start, end) => {
    let shiftlength = differenceInMinutes(end, start)
    let classes = "calendar-week-entry"
    console.log(shiftlength)
    let blockk = document.getElementsByClassName('calendar-week-entry');
     e.target.style.setProperty("--padbottom", (shiftlength/3) + "px");
  }


  mapShifts = () => {

    let shifts = this.state.shifts
    let dateFormat = "HH mm"




    return shifts.map((shift,index) =>
        <div key={index}>
          <p className="calendar-week-entry" onMouseMove={(e) => {this.setLengths(e, shift.start_time*1000, shift.end_time*1000)}}>{format(shift.start_time*1000, dateFormat)} - {format(shift.end_time*1000, dateFormat)}</p>
        </div>
    )
  }


  render(){


    return(
      <div>
        {this.drawShifts()}
      </div>

    )
  }
}

export default ShowWeek;
