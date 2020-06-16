import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Galerie from './Galerie';
import logo from './logo.svg';
import './App.css';
import MainMenu from './MainMenu';
import Playground from './Playground';

import Alert from 'react-bootstrap/Alert';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { storageAvailable } from './helpers';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function App(props) {
    var [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", (e) => setDarkMode(e.matches));

    useEffect(() => {
        if (darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        }
        else {
            document.body.removeAttribute('data-theme');
        }
    });

    /*
    HACK: Das active={false} in den Links im Menü unten ist ein workaround dafür
    dass sonst mehrere Links gleichzeitig aktiv werden, siehe hier:
    https://github.com/react-bootstrap/react-router-bootstrap/issues/242
    */

    return (
        <Router basename={'/static/sudoku'}>
            <div className="App">
                <Navbar collapseOnSelect expand="lg" variant="dark" bg="dark">
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img src={logo} width="30" height="30" className="d-inline-block align-top" alt=""/>{' '}
                            Sudoku-Grid
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <LinkContainer to="/" exact>
                                <Nav.Link active={false}>Hauptmenü</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/galerie" exact>
                                <Nav.Link active={false}>Galerie</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/spielfeld" exact>
                                <Nav.Link active={false}>Spielfeld</Nav.Link>
                            </LinkContainer>
                        </Nav>

                        <Nav>
                            <Form inline style={{marginLeft: "auto", marginRight: "auto"}}>
                            <ButtonGroup toggle>
                                <ToggleButton type="checkbox" variant="outline-secondary" checked={darkMode} onChange={(e) => setDarkMode(e.currentTarget.checked)}>
                                    Dunkler Modus
                                </ToggleButton>
                            </ButtonGroup>
                            </Form>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Switch>
                    <Route path="/" exact>
                        <Alert key={'localStorageWarning'} variant="warning" show={!storageAvailable()}>
                            Da der Speicher nicht zugreifbar ist, sind manche Funktionen eingeschränkt.
                        </Alert>

                        <MainMenu></MainMenu>
                    </Route>

                    <Route path="/spielfeld/:puzzleId?">
                        <Playground></Playground>
                    </Route>

                    <Route path="/galerie">
                        <Container>
                            <Galerie></Galerie>
                        </Container>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
