export function createSaveString(state) {
    let puzzle = {
        name: state.name || "",
        description: state.description || "",
        values: [],
        hintsCorner: [],
        hintsMiddle: [],
        readonly: [],
        colors: [],
        cages: [],
        solution: [],
        overlay: state.overlay || ""
    };

    for (let y = 0; y < 9; ++y) {
        let valuesRow = [];
        let hintsCornerRow = [];
        let hintsMiddleRow = [];
        let readonlyRow = [];
        let colorsRow = [];
        let cagesRow = [];
        let solutionRow = [];

        for (let x = 0; x < 9; ++x) {
            const cell = state.cells[y][x];

            valuesRow.push(cell.value);
            hintsCornerRow.push(cell.hintsCorner);
            hintsMiddleRow.push(cell.hintsMiddle);
            readonlyRow.push(cell.readonly);
            colorsRow.push(cell.color);
            cagesRow.push(
                (cell.cage.left ? "l" : "") +
                (cell.cage.top ? "t" : "") +
                (cell.cage.right ? "r" : "") +
                (cell.cage.bottom ? "b" : "") +
                (cell.cage.sum ? ";" + cell.cage.sum : "")
            );
            solutionRow.push(cell.solution);
        }

        puzzle.values.push(valuesRow);
        puzzle.hintsCorner.push(hintsCornerRow);
        puzzle.hintsMiddle.push(hintsMiddleRow);
        puzzle.readonly.push(readonlyRow);
        puzzle.colors.push(colorsRow);
        puzzle.cages.push(cagesRow);
        puzzle.solution.push(solutionRow);
    }

    return JSON.stringify(puzzle);
}

export function storageAvailable() {
    let storage;

    try {
        let x = '__storage_test__';

        storage = window['localStorage'];
        storage.setItem(x, x);
        storage.removeItem(x);

        return true;
    }
    catch (e) {
        return e instanceof DOMException &&
            (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            (storage && storage.length !== 0);
    }
}

export function savePuzzleInStorage(state) {
    if (storageAvailable()) {
        window['localStorage'].setItem("puzzle", createSaveString(state));
    }
}

export function loadPuzzleFromStorage() {
    if (storageAvailable()) {
        return window['localStorage'].getItem("puzzle") || "{}";
    }
    else {
        return "{}";
    }
}
