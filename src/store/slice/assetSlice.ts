"use client";
import { Asset } from "@prisma/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AssetsState {
  assets: Asset[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AssetsState = {
  assets: [],
  status: "idle",
};

export const fetchAssets = createAsyncThunk(
  "assets/fetchAssets",
  async (assetName: string) => {
    const response = await axios.get("/api/asset", {
      params: {
        asset: assetName,
      },
    });
    return (response.data as { message: string; data: Asset[] }).data;
  },
);

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default assetsSlice.reducer;
