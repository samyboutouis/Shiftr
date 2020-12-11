import React, {Component} from 'react';
import CurrentShift from "./current_shift"
import ShiftPool from '../shift/shift_pool'
import UpcomingShifts from '../shift/upcoming_shifts';

class EmployeeHome extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        {/* <Container fluid>
          <Row>
            <Col lg={7}>
              <Row> */}
              <CurrentShift />
                {/* </Row>
                <Row> */}
              <UpcomingShifts />
            {/* </Row> */}
            {/* </Col>
            <Col lg={5}> */}
            <ShiftPool />
          {/* </Col>
        </Row>
      </Container> */}
      </div>
    );
  }
}

export default EmployeeHome;