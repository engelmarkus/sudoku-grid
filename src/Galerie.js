import React, { useState } from 'react';
import styles from './Galerie.module.css';

import Accordion from 'react-bootstrap/Accordion';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import { useDispatch } from 'react-redux';
import { loadFromString } from './features/grid/gridSlice';

import { LinkContainer } from 'react-router-bootstrap';

import puzzles from './puzzles.json';

function isDownloaded(puzzle) {
    try {
        if (window['localStorage'].getItem(puzzle.name)) {
            const local = JSON.parse(window['localStorage'].getItem(puzzle.name));

            if (local.version && local.name && local.solution) {
                return true;
            }
        }
    }
    catch (e) {
        window['localStorage'].removeItem(puzzle.name);
    }

    return false;
}

function isOutdated(puzzle) {
    if (!isDownloaded(puzzle)) {
        return false;
    }

    const local = JSON.parse(window['localStorage'].getItem(puzzle.name));

    return local.version < puzzle.version;
}


function GalerieControls(props) {
    var dispatch = useDispatch();

    // Dem Nutzer überlassen, ob er die eventuell falsche Version spielen möchte.
    //const [downloaded, setDownloaded] = useState(isDownloaded(props.puzzle) && !isOutdated(props.puzzle));
    const [downloaded, setDownloaded] = useState(isDownloaded(props.puzzle));
    const [isLoading, setIsLoading] = useState(false);

    //function simulateNetworkRequest() {
    //  return new Promise((resolve) => setTimeout(resolve, 2000));
    //}

    async function download(name) {
        setIsLoading(true);

        try {
            const response = await fetch('/static/sudoku/puzzles/' + name);
            const local = await response.json();
            //await simulateNetworkRequest();

            window['localStorage'].setItem(name, JSON.stringify(local));

            setDownloaded(true);
        }
        catch(e) {
            setDownloaded(false);
        }

        setIsLoading(false);
    }

    function remove(name) {
        window['localStorage'].removeItem(name);

        setDownloaded(false);
    }

    function play(name) {
        dispatch(loadFromString(window['localStorage'].getItem(name)));
    }

    return (
        <ButtonGroup>
            {!downloaded &&
            <Button variant="outline-primary" disabled={isLoading} onClick={() => download(props.puzzle.name)}><i className="fa fa-download"/></Button>}

            {downloaded &&
            <>
            <LinkContainer to={"/spielfeld"}>
                <Button variant="outline-success" onClick={() => play(props.puzzle.name)}><i className="fa fa-play"/></Button>
            </LinkContainer>
            <Button variant="outline-danger" onClick={() => remove(props.puzzle.name)}><i className="fa fa-trash-alt"/></Button>
            </>}
        </ButtonGroup>
    );
}

export default function Galerie(props) {
    var dispatch = useDispatch();

    const categories = [];

    for (let c = 0; c < puzzles.categories.length; ++c) {
        const category = puzzles.categories[c];
        let items = [];

        for (let i = 0; i < category.puzzles.length; ++i) {
            const puzzle = category.puzzles[i];

            items.push(
                    <ListGroup.Item key={puzzle.name}>
                        <Form>
                            <Form.Row>
                                <Col style={{textAlign: "left"}}>{puzzle.description}{' '}{puzzle.new && <Badge variant="success">Neu</Badge>}{' '}{isOutdated(puzzle) && <Badge variant="warning">Aktualisierung verfügbar</Badge>}</Col>
                                <Col xs="auto">
                                    <GalerieControls puzzle={puzzle}/>
                                </Col>
                            </Form.Row>
                        </Form>
                    </ListGroup.Item>
            );
        }

        categories.push(
            <Card key={category.name}>
                <Accordion.Toggle as={Card.Header} eventKey={c}>
                    {category.name}
                </Accordion.Toggle>

                <Accordion.Collapse eventKey={c}>
                    <ListGroup variant="flush">
                        {items}
                    </ListGroup>
                </Accordion.Collapse>
            </Card>
        );
    }

    return (
        <div>
            <h1>Galerie</h1>

            <Accordion>
                {categories}
            </Accordion>
        </div>
    );
}
