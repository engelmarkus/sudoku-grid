import { configureStore } from '@reduxjs/toolkit';
import gridReducer from '../features/grid/gridSlice';
import controlsReducer from '../features/controls/controlsSlice';

export default configureStore({
    reducer: {
        grid: gridReducer,
        controls: controlsReducer
    },
});
