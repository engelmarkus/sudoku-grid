import { createSlice } from '@reduxjs/toolkit';

export const controlsSlice = createSlice({
    name: 'controls',
    initialState: {
        numberMode: 1
    },
    reducers: {
        setNumberMode: (state, action) => {
            state.numberMode = action.payload
        }
    }
});

export const {
    setNumberMode
} = controlsSlice.actions;

export default controlsSlice.reducer;
