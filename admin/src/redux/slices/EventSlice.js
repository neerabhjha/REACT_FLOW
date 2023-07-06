import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "eventSlice",
  initialState: {
    eventData: [],
    eventState: false,
    deleteState: false,
  },
  reducers: {
    setEventData: (state, action) => {
      state.eventData = action.payload;
    },
    callEventFunction: (state, action) => {
      state.eventState = action.payload;
    },
    setDeleteState: (state, action) => {
      state.deleteState = action.payload;
    },
  },
});

export const { setEventData, callEventFunction, setDeleteState } =
  eventSlice.actions;
export default eventSlice.reducer;
