// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../redux/features/rootReducer";

const store = configureStore({
  reducer: rootReducer,
  // Add any other middleware or enhancers here if needed
});

export default store;
