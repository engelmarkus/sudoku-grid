import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deselectAll, select } from './features/grid/gridSlice';
import classNames from 'classnames';
import styles from './Cell.module.css';

export default function Cell(props) {
		const state = useSelector(state => state.grid.present.cells[props.y][props.x]);
		const dispatch = useDispatch();

		const mouseDownHandler = (event) => {
			if (event.buttons === 1) {
				if (!event.ctrlKey) {
					dispatch(deselectAll());
				}

				dispatch(select({"x": props.x, "y": props.y}));
			}
		}

		const mouseEnterHandler = (event) => {
			if (event.buttons === 1) {
				dispatch(select({"x": props.x, "y": props.y}));
			}
		}

		const touchHandler = (event) => {
			dispatch(select({"x": props.x, "y": props.y}));
		}

	return (
		<div className={classNames(styles.cell, !state.selected && styles["bgColor" + state.color], state.selected && styles.cellSelected)} onTouchStart={touchHandler} onMouseEnter={mouseEnterHandler} onMouseDown={mouseDownHandler}>
			<div className={classNames(styles.d2, state.cage.top && styles.top, state.cage.bottom && styles.bottom, state.cage.left && styles.left, state.cage.right && styles.right)}/>
			<span className={styles.dashedSum}>{state.cage.sum}</span>

			{state.value === 0 &&
			<div>
				<span className={styles.smallNumberUpperLeft}>{state.hintsCorner[0] || ""}</span>
				<span className={styles.smallNumberUpperRight}>{state.hintsCorner[1] || ""}</span>
				<span className={styles.smallNumberLowerLeft}>{state.hintsCorner[2] || ""}</span>
				<span className={styles.smallNumberLowerRight}>{state.hintsCorner[3] || ""}</span>

				<span className={styles.smallNumbersMiddle}>{state.hintsMiddle.join("")}</span>
			</div>
			}

			{state.value !== 0 &&
			<span className={classNames(styles.bigNumber, state.readonly && styles.readonlyCell)}>{state.value}</span>
			}
		</div>
	);
}
