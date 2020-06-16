import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Grid from './features/grid/Grid';
import Controls from './features/controls/Controls';
import { deselectAll } from './features/grid/gridSlice';

import { useDispatch } from 'react-redux';

export default function Playground(props) {
    const dispatch = useDispatch();

    return (
        <Container style={{width: "fit-content", height: "fit-content"}}>
            <Row/>
            <Row className="align-items-center">
                <Col onDoubleClick={() => dispatch(deselectAll())}>
                    <Grid></Grid>
                </Col>
                <Col>
                    <Controls></Controls>
                </Col>
            </Row>
            <Row/>
        </Container>
    );
}
