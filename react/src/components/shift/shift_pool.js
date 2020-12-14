import React, {Component} from 'react';
import Pool from '../../pool.png';
import OpenShifts from './open'

class ShiftPool extends Component {
  constructor(props){
      super();
  }

  render() {
    return (
      <div className='shift-pool'>
        <p className="shift-pool-title">
          <img src={Pool} className='shift-pool-image' alt="Pool"/> 
          Shift Pool 
        </p>
        {/*FOR EACH OPEN/PENDING SHIFT IN POOL*/}
        <div>
          <OpenShifts />
        </div>
      </div>
    );
  }
}

export default ShiftPool;