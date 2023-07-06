import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "mailer",
  initialState: {
    emailData: [],
    open: false,
    idFromEmailNode: "",
    // emailSubmitState: true,
  },
  reducers: {
    setEmailId: (state, action) => {
      state.idFromEmailNode = action.payload;
    },
    setEmailData: (state, action) => {
      state.emailData = action.payload;
    },
    OpenMailer: (state, action) => {
      state.open = action.payload;
    },
    // setEmailSubmitState: (state, action) => {
    //   state.emailSubmitState = action.payload
    // }
  },
});

export const { OpenMailer, setEmailData, setEmailId, setEmailSubmitState } = emailSlice.actions;
export default emailSlice.reducer;
