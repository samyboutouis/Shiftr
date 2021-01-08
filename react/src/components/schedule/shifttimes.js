import React, {Component} from 'react';
import format from "date-fns/format";


class ShiftTimes extends Component {
  constructor(props){
    super()
  }

  componentDidMount = () => {
    this.getNotes()
  }

  getNotes = (props) => {
    let self = this
    let shift = self.props.shift
    const newshift = shift
    let start = newshift.start_time
    let end = newshift.end_time
    let dateformat = "HH:mm"
    let startTime = format(start * 1000, dateformat)
    let endTime = format(end  * 1000, dateformat)
    return(<div>{startTime} -  {endTime}</div>)
  }

  render(){
    return(
     <div>
        {this.getNotes()}
     </div>
    )
  }
}

export default ShiftTimes;
