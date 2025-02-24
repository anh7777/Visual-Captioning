import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  user: null,
  isLoading: true
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    deleteState: (state) => {
      state.user = null;
      state.isLoading = false;
    }
  }
});

export const { setUser, setIsLoading, deleteState } = appSlice.actions;

export default appSlice.reducer;