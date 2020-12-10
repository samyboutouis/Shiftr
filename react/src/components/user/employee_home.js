import React, {Component} from 'react';
import CurrentShift from "./current_shift"
import ShiftPool from '../shift/shift_pool'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import UpcomingShifts from '../shift/upcoming_shifts';

class EmployeeHome extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col lg={7}>
            <Row>
              <CurrentShift />
            </Row>
            <Row>
              <UpcomingShifts />
            </Row>
          </Col>
          <Col lg={5}>
            <ShiftPool />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default EmployeeHome;