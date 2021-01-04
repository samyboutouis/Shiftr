import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import getHours from "date-fns/getHours"
import getMinutes from "date-fns/getMinutes"
import differenceInMinutes from "date-fns/differenceInMinutes"

class ShowWeek extends Component {
  constructor(props){
    super()
    this.state= {shifts: false}
  }

  componentDidMount = () => {
    this.getShifts()
  }

  getShifts = (props) => {

    let self = this
    const end = this.props.start+86400
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

  mapShifts = () => {
    let shifts = this.state.shifts
    var cells=[];
    for(let i=0;i<24; i++) {
      if(shifts[i]){
    shifts[i].data.map((shift,index) =>
        cells.push(<div className="calendar-week-entry" key={i+' '+index} style={{position: "absolute", top: ((getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000))/3)+240, paddingBottom: ((differenceInMinutes(shift.end_time*1000, shift.start_time*1000)/3))}}>
                {format(shift.start_time*1000, "HH mm")} - {format(shift.end_time*1000, "HH mm")}
                </div>
    ))}}
    return cells;
  }


  render(){
    return(
      <div>
        {this.drawShifts()}
        <div className="spacing-cell"> &nbsp;
        </div>
      </div>
    )
  }
}

export default ShowWeek;
