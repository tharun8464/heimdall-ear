// popupSlice.js
import { createSlice, getDefaultMiddleware } from "@reduxjs/toolkit";

const initialState = {
  popupOpen: false,
  popupComponent: null,
  popupCenterOpen: false,
  popupCenterComponent: null,
  popupCenterClosingFunction: null,
  isClosable: true,
  uniqueComponent: false,
  hasConversionPopUpRendered: false,
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    setPopupOpen: (state, action) => {
      state.popupOpen = action.payload;
    },
    setPopupComponentRender: (state, action) => {
      state.popupComponent = action.payload;
    },
    setPopupCenterOpen: (state, action) => {
      state.popupCenterOpen = action.payload;
    },
    // center
    setPopupCenterComponentRender: (state, action) => {
      state.popupCenterComponent = action.payload;
    },
    setPopupCenterClosingFunction: (state, action) => {
      state.popupCenterClosingFunction = action.payload;
    },
    setPopupCenterClosable: (state, action) => {
      state.isClosable = action.payload;
    },
    setUniqueComponent: (state) => {
      state.uniqueComponent = true;
    },
    setUniqueComponentClosing: (state) => {
      state.uniqueComponent = false;
      state.popupComponent = null;
    },
    setConversionPopupRender: (state) => {
      state.hasConversionPopUpRendered = true;
    },
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export const {
  setPopupOpen,
  setPopupComponentRender,
  setPopupCenterOpen,
  setPopupCenterComponentRender,
  setPopupCenterClosingFunction,
  setPopupCenterClosable,
  setUniqueComponent,
  setUniqueComponentClosing,
  setConversionPopupRender,
} = popupSlice.actions;

export default popupSlice.reducer;
