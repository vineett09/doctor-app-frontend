import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  doctorId: null, // Add doctorId to initial state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.doctorId = action.payload.doctorId; // Ensure this is correct
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.doctorId = null; // Reset doctorId on logout
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
