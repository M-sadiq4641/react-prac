import { AppConfigService } from "@/services/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState = {
  config: null,
};

export const loadConfig = createAsyncThunk(
  "loadConfig",
  async (_, thunkAPI) => {
    try {
      const res = await AppConfigService.getConfig();
      if (!res?.data) throw "Failed";
      return res?.data;
    } catch (err) {
      console.log(err);
    }
  }
);

const configSlice = createSlice({
  name: "configSlice",
  initialState,
  reducers: {},
  extraReducers: {
    //load config
    [loadConfig.fulfilled.toString()]: (state, { payload }) => {
      state.config = payload;
    },
  },
});

export const configReducer = configSlice.reducer;
