import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import getHours from "date-fns/getHours"
import getMinutes from "date-fns/getMinutes"
import differenceInMinutes from "date-fns/differenceInMinutes"

class ShowDay extends Component {
  constructor(props){
    super()
    this.state= {shifts: false}
  }

  componentDidMount = () => {
    this.getShifts()
  }

/* query database by hour */
  getShifts = (props) => {
    let self = this
    const end = this.props.start+3600
    console.log("START:"+this.props.start)
    console.log("END:"+ end)
    axios.get("http://localhost:8080/shifts/find_time/" + this.props.start + "/" + end).then( (response) => {
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

/* format and size the display of queries */
  mapShifts = () => {
    let shifts = this.state.shifts
    var cells=[];
    for(let i=0;i<24; i++) {
      if(shifts[i]){
        shifts[i].data.map((shift,index) =>
            cells.push(<div className={"calendar-day-entry " + shift.group} key={i+' '+index} style={{position: "absolute", top: ((getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000))/2)+110, paddingBottom: ((differenceInMinutes(shift.end_time*1000, shift.start_time*1000)/2.5)-20)}}>
                    {format(shift.start_time*1000, "HH mm")} - {format(shift.end_time*1000, "HH mm")}
                    <br />
                    {shift.group}
                    <br />
                    {shift.location}
                    </div>
        ))}}
    return cells;
  }


  render(){
    return(
      <div>
        {this.drawShifts()}
      </div>
    )
  }
}

export default ShowDay;
