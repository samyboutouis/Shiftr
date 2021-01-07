import React, {Component} from 'react';
import axios from 'axios';

class Notes extends Component {
  constructor(props){
    super()
  }


  componentDidMount = () => {
    this.getShifts()
  }

  drawNotes = () => {
    if(this.state.shifts){
      return <div>
        {this.mapNotes()}
      </div>
    }
  }



/* format queries */
  mapNotes = (props) => {
    let shift = this.props.shift
    return(
      <div>
      </div>
    )
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
