import React, {Component} from 'react';

class UserAvailability extends Component {
  constructor(props){
    super()
  }

  convertDate = (mongoDate) => {
    let date = new Date(mongoDate * 1000)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  drawAvailability = () => {
    if(this.props.user.availability){
      let avail = this.props.user.availability.times
      return avail.map((shift,index) =>
        <div key={index}>
            <p>START TIME: {this.convertDate(shift.start_time)}</p>
            <p>END TIME:    {this.convertDate(shift.end_time)}</p>
        </div>
      )
    }
  }

  render(){
    return(
     <div>
        <h3>{this.props.user.name}</h3>
        <p>Availability: {this.drawAvailability()}</p>
      </div>

    )
  }
}

export default UserAvailability;
