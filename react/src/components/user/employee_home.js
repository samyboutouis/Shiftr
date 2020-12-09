import React, {Component} from 'react';
import CurrentShift from "./current_shift"
import OpenShifts from '../shift/open'
import ShiftIndex from '../shift/index'
import Pool from '../../pool.png';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class EmployeeHome extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col md={7}>
                    <Row>
                        <CurrentShift />
                    </Row>
                    <Row>
                        <p style={{padding: '0 0 0 1em', fontSize: '2.5em', fontFamily:'Roboto', fontWeight:'normal'}}>Your Upcoming Shifts</p>
                        <ShiftIndex />
                    </Row>
                    </Col>
                    <Col md={5}>
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