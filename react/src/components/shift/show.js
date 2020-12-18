import React, {Component} from 'react';
import axios from 'axios';
import ShiftForm from './form'

class ShiftShow extends Component {
  constructor(props){
    super()
  }

  deleteShift = () => {
    axios.delete("http://localhost:8080/shifts/delete/" + this.props.shift._id).then( (response) => {
      this.props.getShifts()
      this.props.clearSelectedShift()
    })
    .catch((err) => {
      console.log(err)
    });
  }


  render(){
    return(
     <div>
        <h3>START TIME: {this.props.shift.start_time}</h3>
        <p>END TIME:    {this.props.shift.end_time}</p>
        <p>ID:   {this.props.shift._id}</p>
        <button onClick={() => this.props.clearSelectedShift()}>Back</button>
        <button onClick={this.deleteShift}>Delete</button>
        <ShiftForm getShifts={this.props.getShifts} clearSelectedShift={this.props.clearSelectedShift} shift={this.props.shift} reqType="update" />
      </div>

    )
  }
}

export default ShiftShow;