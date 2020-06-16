import React from 'react';
import styles from './Grid.module.css';
import Cell from '../../Cell.js';

import { useSelector, useDispatch } from 'react-redux';
import { setValue, setHintsCorner, setHintsMiddle } from './gridSlice';

function biToXy(b, i) {
    const x = (b % 3) * 3 + (i % 3);
    const y = Math.floor(b / 3) * 3 + Math.floor(i / 3);

    return [x, y];
}

export default function Grid() {
    const numberMode = useSelector(state => state.controls.numberMode);
    const dispatch = useDispatch();

    const overlay = useSelector(state => state.grid.present.overlay);

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

    function handleKeyPress(e) {
        switch (e.key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                onNumberClick(parseInt(e.key, 10));
                break;

            default:
                break;
        }
    }

    let ovl;

    if (overlay !== "") {
        ovl =
            <>
            <img src={"data:image/svg+xml;base64," + overlay} alt="" style={{ "pointerEvents": "none", "display": "block", "maxWidth": "calc(90vmin + 10px)", "maxHeight": "calc(90vmin + 10px)", "fontSize": "21pt", "height": "calc(18em + 10px)", "position": "absolute", "top": "11px", "left": "15px"}}/>
            </>;
    }

	let boxes = [];

	for (let b = 0; b < 9; ++b) {
		let cells = [];

		for (let i = 0; i < 9; ++i) {
			const [x, y] = biToXy(b, i);

			cells.push(<Cell key={"cell" + (b * 9 + i)} box={b} index={i} x={x} y={y}/>);
		}

		boxes.push(<div key={"box" + b} className={styles.box}>{cells}</div>);
	}

	return(
        <div>
		<div className={styles.grid} onKeyDown={handleKeyPress} tabIndex={-1}>
			{boxes}
		</div>

        {ovl}

        </div>
	);
}
