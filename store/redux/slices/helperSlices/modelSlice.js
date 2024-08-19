import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState = {
  collapsed: null,
  modelOpen: null,
};

export const collapsedDashboard = createAsyncThunk(
  "collapsedDashboard",
  async (collapsed, thunkAPI) => {
    try {
      const result = collapsed;
      return result;
    } catch (error) {
      console.log("Error");
      return error;
    }
  }
);

export const mainModel = createAsyncThunk(
  "connectModel",
  async (modelOpen, thunkAPI) => {
    try {
      const result = modelOpen;
      return result;
    } catch (error) {
      console.log("Error");
      return error;
    }
  }
);

const modelSlice = createSlice({
  name: "ModalSlide",
  initialState,
  reducers: {},
  extraReducers: {
    [collapsedDashboard.fulfilled.toString()]: (state, { payload }) => {
      state.collapsed = payload;
    },
    [mainModel.fulfilled.toString()]: (state, { payload }) => {
      state.modelOpen = payload;
    },
  },
});

export const modelReducer = modelSlice.reducer;
