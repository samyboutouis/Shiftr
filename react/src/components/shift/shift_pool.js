import React, {Component} from 'react';
import Pool from '../../pool.png';
import OpenShifts from './open'

class ShiftPool extends Component {
  constructor(props){
      super(props);
  }

  render() {
    return (
      <div className="shift-pool">
        <p style={{textAlign: 'left', padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>
        <img src={Pool} style={{height:'1em', margin: '0 .5em 0 2em'}}/> Shift Pool </p>
        {/*FOR EACH OPEN/PENDING SHIFT IN POOL*/}
        <div>
          <OpenShifts />
        </div>
      </div>
    );
  }
}

export default ShiftPool;