import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setValue, setHintsCorner, setHintsMiddle, setColor, clearValue, toggleLockSelected, markWrongCells, createCage } from '../grid/gridSlice';
import { setNumberMode } from './controlsSlice';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { ActionCreators } from 'redux-undo';

export default function Controls(props) {
	const dispatch = useDispatch();
	const numberMode = useSelector(state => state.controls.numberMode);

	const cells = useSelector(state => state.grid.present.cells);
	const undoPossible = useSelector(state => state.grid.past.length > 0);
	const redoPossible = useSelector(state => state.grid.future.length > 0);

	const name = useSelector(state => state.grid.present.name);
	const description = useSelector(state => state.grid.present.description);

	function getLockState() {
		const ros = cells.flat().some((c) => c.selected && c.readonly);
		const rws = cells.flat().some((c) => c.selected && !c.readonly);

		if ((!ros && !rws) || (ros && rws)) {
			return -1;
		}
		else if (ros) {
			return 1;
		}
		else {
			return 0;
		}
	}

	function onNumberClick(number) {
		switch (numberMode) {
			case 1:
				dispatch(setHintsCorner(number));
				break;

			case 2:
				dispatch(setHintsMiddle(number));
				break;

			case 3:
				dispatch(setValue(number));
				break;

			default:
				break;
		}
	}

	const rules =
	<Popover>
		<Popover.Title as="h3">Regeln: {name}</Popover.Title>
		<Popover.Content>
			{description}
		</Popover.Content>
	</Popover>

	return (
		<Form style={{ "margin": "10px 0"}}>
			<Form.Row>
				<Col xs="3" md="3">
					<Form.Group>
						<ToggleButtonGroup vertical type="radio" name="options" defaultValue={numberMode} onChange={(value) => dispatch(setNumberMode(value))}>
							<ToggleButton variant="outline-secondary" value={3}>Normal</ToggleButton>
							<ToggleButton variant="outline-secondary" value={1}>Ecke</ToggleButton>
							<ToggleButton variant="outline-secondary" value={2}>Mitte</ToggleButton>
						</ToggleButtonGroup>
					</Form.Group>

					<Form.Group>
						<Dropdown onSelect={(key) => dispatch(setColor(key))}>
							<Dropdown.Toggle variant="outline-secondary">
								<i className="fa fa-fill-drip"/>
							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item eventKey="0"><i className="fa fa-square" style={{"color": "#FFFFFF"}}/> Weiß</Dropdown.Item>
								<Dropdown.Item eventKey="1"><i className="fa fa-square" style={{"color": "#EC88A0"}}/> Rot</Dropdown.Item>
								<Dropdown.Item eventKey="2"><i className="fa fa-square" style={{"color": "#F8DD9C"}}/> Gelb</Dropdown.Item>
								<Dropdown.Item eventKey="3"><i className="fa fa-square" style={{"color": "#47EEC2"}}/> Grün</Dropdown.Item>
								<Dropdown.Item eventKey="4"><i className="fa fa-square" style={{"color": "#43B9E0"}}/> Blau</Dropdown.Item>
								<Dropdown.Item eventKey="5"><i className="fa fa-square" style={{"color": "#F09C57"}}/> Orange</Dropdown.Item>
								<Dropdown.Item eventKey="6"><i className="fa fa-square" style={{"color": "#a87eec"}}/> Lila</Dropdown.Item>
								<Dropdown.Item eventKey="7"><i className="fa fa-square" style={{"color": "#CEB5B7"}}/> Braun</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Form.Group>
				</Col>
				<Col xs="6" md="6" style={{"width": "14em"}}>
					<Form.Group>
						<Button size="lg" variant="outline-secondary" onClick={() => onNumberClick(1)}>1</Button>{' '}
						<Button size="lg" variant="outline-secondary" onClick={() => onNumberClick(2)}>2</Button>{' '}
						<Button size="lg" variant="outline-secondary" onClick={() => onNumberClick(3)}>3</Button>
					</Form.Group>
					<Form.Group>
						<Button size="lg" variant="outline-secondary" onClick={() => onNumberClick(4)}>4</Button>{' '}
						<Button size="lg" variant="outline-secondary" onClick={() => onNumberClick(5)}>5</Button>{' '}
						<Button size="lg" variant="outline-secondary" onClick={() => onNumberClick(6)}>6</Button>
					</Form.Group>
					<Form.Group>
						<Button size="lg" variant="outline-secondary" onClick={() => onNumberClick(7)}>7</Button>{' '}
						<Button size="lg" variant="outline-secondary" onClick={() => onNumberClick(8)}>8</Button>{' '}
						<Button size="lg" variant="outline-secondary" onClick={() => onNumberClick(9)}>9</Button>
					</Form.Group>
					<Form.Group>
						<ButtonGroup>
							<Button variant="outline-secondary" disabled={!undoPossible} onClick={() => dispatch(ActionCreators.undo())}><i className="fa fa-undo-alt"/></Button>{' '}
							<Button variant="outline-secondary" onClick={() => dispatch(clearValue())}><i className="fa fa-eraser"/></Button>{' '}
							<Button variant="outline-secondary" disabled={!redoPossible} onClick={() => dispatch(ActionCreators.redo())}><i className="fa fa-redo-alt"/></Button>
						</ButtonGroup>
					</Form.Group>
				</Col>

				<Col xs="3" md="3">
					<ButtonGroup vertical>
						<OverlayTrigger trigger="click" overlay={rules}>
							<Button variant="outline-secondary"><i className="fab fa-readme"/></Button>
						</OverlayTrigger>

						<Button variant="outline-secondary" onClick={() => dispatch(markWrongCells())}><i className="fa fa-check-square"/></Button>

						<ToggleButtonGroup type="checkbox" name="lock" value={getLockState() === 0 ? [] : [1]} onChange={() => dispatch(toggleLockSelected())}>
							<ToggleButton disabled={getLockState() === -1} variant="outline-secondary" value={1}><i className="fa fa-unlock-alt"/></ToggleButton>
						</ToggleButtonGroup>

						<Button variant="outline-secondary" onClick={() => dispatch(createCage())}><i className="fa fa-border-none"/></Button>
					</ButtonGroup>
				</Col>
			</Form.Row>
		</Form>
	);
}
