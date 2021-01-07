import React, {Component} from 'react';
import axios from 'axios';
import fromUnixTime from "date-fns/fromUnixTime";

class Notes extends Component {
  constructor(props){
    super()
  }


  componentDidMount = () => {
    this.getNotes()
  }

  getTimes = (start, end) => {
    let startTime = fromUnixTime(parseInt(start)*1000)
    let endTime = fromUnixTime(parseInt(end)*1000)
    console.log("HEY")
    console.log(typeof(startTime))
    return(<div> startTime -  endTime</div>)
  }


  getNotes = (props) => {
    let self = this
    // let start = self.props.start
    // let end = self.props.end

    // let start = shift.start_time
    // let end = shift.end_time
    // let startTime = fromUnixTime(parseInt(start)*1000)
    // let endTime = fromUnixTime(parseInt(end)*1000)
    // console.log("HEY")
    // console.log("SHIFT TYPE"+typeof(shift))
    // console.log("SHIFT"+(shift))
    // console.log("TIME TYPE BEFORE CONVERT"+typeof(parseInt(start)))
    // console.log("TIME BEFORE CONVERT"+(parseInt(start)))
    // console.log("TYPE AFTER CONVERT FROM UNIX"+typeof(startTime))
    // console.log("TIME AFTER CONVERT"+startTime)


    return(<div>
      {/*<div>{startTime} -  {endTime} </div>*/}
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
