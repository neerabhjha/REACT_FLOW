import { createSlice } from "@reduxjs/toolkit";

const edgeCountSlice = createSlice({
  name: "edgeCount",
  initialState: {
    edgeCount: 0,
  },
  reducers: {
    increaseEdgeCount: (state) => {
      state.edgeCount = state.edgeCount + 1;
    },
    decreaseEdgeCount: (state) => {
      state.edgeCount -= 1;
    },
    setEdgeCount: (state, action) => {
        state.edgeCount = action.payload;
    }
  },
});

export const { increaseEdgeCount, decreaseEdgeCount, setEdgeCount } = edgeCountSlice.actions;
export default edgeCountSlice.reducer;
