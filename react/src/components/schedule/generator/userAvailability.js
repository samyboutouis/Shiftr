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
        {/* <p>Rank:   {this.props.user.rank }</p> */}
        {/* <p>Total Available Hours:   {this.props.user.total_available_hours/3600 }</p> */}
        <p>Preferred Hours:   {this.props.user.availability.preferred_hours }</p>
        <p>Availability: </p>
        {this.drawAvailability()}
        <br/>
      </div>

    )
  }
}

export default UserAvailability;
