import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { loadFromString, clearAll } from './features/grid/gridSlice';
import Button from 'react-bootstrap/Button';
import './App.css';

import { loadPuzzleFromStorage } from './helpers';
import { createSaveString } from './helpers';

import Form from 'react-bootstrap/Form';

export default function MainMenu(props) {
    var dispatch = useDispatch();
    var inputFile = useRef(null);
    var state = useSelector(state => state.grid.present);

    const history = useHistory();


    function readFile(file) {
        let fileReader = new FileReader();

        fileReader.onload = (e) => {
            dispatch(loadFromString(fileReader.result));
            history.push("/spielfeld");
        };

        fileReader.readAsText(file);
    }

    return (
        <Form style={{ margin: "4em" }}>
            <LinkContainer to="/spielfeld">
                <Button block variant="outline-secondary" disabled={!window['localStorage'].getItem("puzzle")} onClick={() => dispatch(loadFromString(loadPuzzleFromStorage()))}>Fortfahren</Button>
            </LinkContainer>

            <hr/>

            <LinkContainer to="/spielfeld">
                <Button block variant="outline-secondary" onClick={() => dispatch(clearAll())}>Leeres Spielfeld</Button>
            </LinkContainer>

            <LinkContainer to="/galerie">
                <Button block variant="outline-secondary">Galerie</Button>
            </LinkContainer>

            <Button block variant="outline-secondary" onClick={() => inputFile.current.click()}>Puzzle-Datei laden</Button>

            <Button block variant="outline-secondary" href={'data:application/json;charset=utf-8,' + encodeURIComponent(createSaveString(state))} download="sudoku.json">Speichern</Button>

            <input hidden type="file" id="file" ref={inputFile} accept=".json" onChange={(e) => { e.target.files[0] && readFile(e.target.files[0]); e.target.value = ''; }}/>
        </Form>
    );
}
