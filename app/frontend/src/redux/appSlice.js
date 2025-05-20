import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    mode: null
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setMode: (state, action) => {
            state.mode = action.payload;
        },
        deleteState: (state) => {
            state.user = null;
            state.mode = null;
        }
    }
});

export const { setUser, setMode, deleteState } = appSlice.actions;
export default appSlice.reducer;