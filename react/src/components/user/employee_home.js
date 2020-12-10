import React, {Component} from 'react';
import CurrentShift from "./current_shift"
import OpenShifts from '../shift/open'
import Pool from '../../pool.png';
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
            <div className="shift-pool">
              <p style={{textAlign: 'left', padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>
              <img src={Pool} style={{height:'1em', margin: '0 .5em 0 2em'}}/> Shift Pool </p>
              {/*FOR EACH OPEN/PENDING SHIFT IN POOL*/}
              <div>
                <OpenShifts />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default EmployeeHome;