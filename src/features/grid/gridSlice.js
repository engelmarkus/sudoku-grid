import { createSlice } from '@reduxjs/toolkit';

import undoable, { excludeAction } from 'redux-undo';

import { savePuzzleInStorage } from '../../helpers';

function deserializeCage(str) {
    const [borders="", sum=""] = str.split(";");

    return {
        "left": borders.includes("l"),
        "top": borders.includes("t"),
        "right": borders.includes("r"),
        "bottom": borders.includes("b"),
        "sum": sum
    };
}

function deserializeCells(str) {
    try {
        let puzzle = JSON.parse(str);
        let grid = [];

        for (let y = 0; y < 9; ++y) {
            let row = [];

            for (let x = 0; x < 9; ++x) {
                row.push({
                    "value": (puzzle.values && puzzle.values[y] && puzzle.values[y][x]) || 0,
                    "hintsCorner": (puzzle.hintsCorner && puzzle.hintsCorner[y] && puzzle.hintsCorner[y][x]) || [],
                    "hintsMiddle": (puzzle.hintsMiddle && puzzle.hintsMiddle[y] && puzzle.hintsMiddle[y][x]) || [],
                    "readonly": (puzzle.readonly && puzzle.readonly[y] && puzzle.readonly[y][x]) || false,
                    "color": (puzzle.colors && puzzle.colors[y] && puzzle.colors[y][x]) || 0,
                    "cage": deserializeCage((puzzle.cages && puzzle.cages[y] && puzzle.cages[y][x]) || ""),
                    "solution": (puzzle.solution && puzzle.solution[y] && puzzle.solution[y][x]) || null,
                    "selected": false
                });
            }

            grid.push(row);
        }

        return grid;

    }
    catch (e) {
        return deserializeCells("{}");
    }
}

export const gridSlice = createSlice({
  name: 'grid',
  initialState: {
      name: "",
      description: "",
      cells: deserializeCells("{}"),
      overlay: "",

    showIntro: false
  },
  reducers: {
    setName: (state, action) => {
        state.name = action.payload
    },
    setDescription: (state, action) => {
        state.description = action.payload
    },
    setCells: (state, action) => {
        state.cells = action.payload
    },
    setOverlay: (state, action) => {
        state.overlay = action.payload
    },
    createCage: (state) => {
        for (let y = 0; y < 9; ++y) {
            for (let x = 0; x < 9; ++x) {
                if (state.cells[y][x].selected) {
                    let border = "";

                    if (x === 0 || !state.cells[y][x - 1].selected) {
                        border += "l";
                    }

                    if (x === 8 || !state.cells[y][x + 1].selected) {
                        border += "r";
                    }

                    if (y === 0 || !state.cells[y - 1][x].selected) {
                        border += "t";
                    }

                    if (y === 8 || !state.cells[y + 1][x].selected) {
                        border += "b";
                    }

                    state.cells[y][x].cage = deserializeCage(border);
                }
            }
        }
    },
    setShowIntro: (state, action) => {
        state.showIntro = action.payload;
    },
    loadFromString: (state, action) => {
        try {
            let json = JSON.parse(action.payload);

            state.name = json.name || "";
            state.description = json.description || "";
            state.overlay = json.overlay || "";
            state.cells = deserializeCells(action.payload);
        }
        catch (e) {
            state.name = "";
            state.description = "";
            state.overlay = "";
            state.cells = deserializeCells("{}");
        }
    },
    deselectAll: state => {
        state.cells.flat().forEach((c) => c.selected = false);
    },
    select: (state, action) => {
        state.cells[action.payload.y][action.payload.x].selected = true;
    },
    toggleLockSelected: (state) => {
        state.cells.flat().filter((c) => c.selected).forEach((c) => c.readonly = !c.readonly);

        savePuzzleInStorage(state);
    },
    clearAll: (state) => {
        state.name = "";
        state.description = "";
        state.cells = deserializeCells("{}");
        state.overlay = "";
    },
    clearValue: (state) => {
        state.cells.flat().filter((c) => c.selected && !c.readonly).forEach((c) => {
            c.value = 0;
            c.hintsCorner = [];
            c.hintsMiddle = [];
        });

        savePuzzleInStorage(state);
    },
    setValue: (state, action) => {
        state.cells.flat().filter((c) => c.selected && !c.readonly).forEach((c) =>
            c.value = c.value === action.payload ? 0 : action.payload
        );

        savePuzzleInStorage(state);
    },
    setHintsCorner: (state, action) => {
        state.cells.flat().filter((c) => c.selected && !c.readonly).forEach((c) => {
            let hints = c.hintsCorner;

            if (hints.includes(action.payload)) {
                hints.splice(hints.indexOf(action.payload), 1);
            }
            else {
                hints.push(action.payload);
                hints.sort();
            }

            c.hintsCorner = hints;
        });

        savePuzzleInStorage(state);
    },
    setHintsMiddle: (state, action) => {
        state.cells.flat().filter((c) => c.selected && !c.readonly).forEach((c) => {
            let hints = c.hintsMiddle;

            if (hints.includes(action.payload)) {
                hints.splice(hints.indexOf(action.payload), 1);
            }
            else {
                hints.push(action.payload);
                hints.sort();
            }

            c.hintsMiddle = hints;
        });

        savePuzzleInStorage(state);
    },
    setColor: (state, action) => {
        state.cells.flat().filter((c) => c.selected).forEach((c) => c.color = action.payload);

        savePuzzleInStorage(state);
    },
    markWrongCells: state => {
        state.cells.flat().forEach(c => c.selected = false);
        state.cells.flat().filter(c =>
            (c.value && !c.solution) ||
            (c.value && c.solution && c.value !== c.solution)
        ).forEach(c => c.selected = true);
    }
  }
});

export const {
    setName, setDescription, setCells, setOverlay,
    deselectAll, select, setValue, setHintsCorner, setHintsMiddle,
    setColor, clearValue, loadFromString, toggleLockSelected, clearAll, undo, redo, setShowIntro, markWrongCells, createCage
} = gridSlice.actions;

export default undoable(gridSlice.reducer, {
    filter: excludeAction([
        `${setName}`, `${setDescription}`, `${setCells}`, `${setOverlay}`,
        `${select}`, `${deselectAll}`, `${markWrongCells}`
    ])
});
