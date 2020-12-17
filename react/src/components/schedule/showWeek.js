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
// var styles = getComputedStyle(document.documentElement);
// var marg = styles.getPropertyValue('--marg');

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
    // height: (shiftlength/6) + "px"
    console.log(shiftlength)
    let blockk = document.getElementsByClassName('calendar-week-entry');
    // if(shiftlength > 0){
    //     e.target.classList.add('add')
    //  }
     // e.target.classList.add('add');
     e.target.style.setProperty("--padbottom", (shiftlength/3) + "px");
  }


  mapShifts = () => {

    let shifts = this.state.shifts
    let dateFormat = "HH mm"




    return shifts.map((shift,index) =>
      // if ((shift.start_time - shift.end_time) >0 && (shift.start_time - shift.end_time) <1){
        <div key={index}>
          {/*{document.documentElement.style.setProperty("--color", "yellow")}*/}
          <p className="calendar-week-entry" onMouseMove={(e) => {this.setLengths(e, shift.start_time*1000, shift.end_time*1000)}}>{format(shift.start_time*1000, dateFormat)} - {format(shift.end_time*1000, dateFormat)}</p>
        </div>
      // }
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
