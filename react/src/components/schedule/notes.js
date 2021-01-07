import React, {Component} from 'react';
import axios from 'axios';
import fromUnixTime from "date-fns/fromUnixTime";
import format from "date-fns/format"
class Notes extends Component {
  constructor(props){
    super()
  }


  componentDidMount = () => {
    this.getNotes()
  }



  getNotes = (props) => {
    let self = this
    // let start = self.props.start
    // let end = self.props.end
    let shift = self.props.shift
    const newshift = shift
    let start = newshift.start_time
    let end = newshift.end_time
    let dateformat = "HH:mm"
    let startTime = format(start * 1000, dateformat)
    let endTime = format(end  * 1000, dateformat)
    return(<div>
      <div>{startTime} -  {endTime} </div>
      </div>)
    // const start = getUnixTime(startOfDay(this.props.day))
    // const end = getUnixTime(endOfDay(this.props.day))
    // axios.get("http://localhost:8080/shifts/find_day/" + start + "/" + end ).then( (response) => {
    //   self.setState({shifts: response.data})
    // }).catch( (error) => {
    //   console.log(error)
    // });
  }

  drawNotes = () => {
      return <div>
        {this.getNotes()}
      </div>
    }


  render(){
    return(
     <div>
        {this.drawNotes()}
     </div>
    )
  }
}

export default Notes;
