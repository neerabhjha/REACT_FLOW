import { configureStore } from "@reduxjs/toolkit";
import emailReducer from "../slices/EmailSlice";
import eventReducer from "../slices/EventSlice";
import edgeCountReducer from "../slices/EdgeCount";

const store = configureStore({
  reducer: {
    emailReducer,
    eventReducer,
    edgeCountReducer
  },
});

export default store;
