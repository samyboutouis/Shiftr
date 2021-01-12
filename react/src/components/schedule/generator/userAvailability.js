import React, {Component} from 'react';
import format from 'date-fns/format'

class UserAvailability extends Component {
  constructor(props){
    super()
  }

  drawAvailability = () => {
    if(this.props.user.availability){
      let avail = this.props.user.availability.times
      return avail.map((shift,index) =>
        <tr key={index}>
          <td> {format(shift.start_time*1000, "M/d/y")}</td>
          <td> {format(shift.start_time*1000, "HH:mm")}</td>
          <td> {format(shift.end_time*1000, "HH:mm")}</td>
        </tr>
      )
    }
  }

  render(){
    return( 
      <div className="message mt-5">
        <div className="message-header">
            <p>{this.props.user.name}</p>
            <p>Preferred Hours:   {this.props.user.availability ? this.props.user.availability.preferred_hours : 'Unknown' }</p>
        </div>
        <div className="message-body">
          <table className = "table is-bordered is-striped is-full-width">
            <thead> 
                <tr>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
            </thead> 
            <tbody>
                {this.drawAvailability()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default UserAvailability;
