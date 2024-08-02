"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/store";
import { fetchAssets } from "~/store/slice/assetSlice";
import LoaderOverlay from "../components/LoaderOverlay";

const AssetTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const assets = useSelector((state: RootState) => state.assets.assets);
  const status = useSelector((state: RootState) => state.assets.status);
  const [selectedAsset, setSelectedAsset] = useState<string>("Bitcoin");

  useEffect(() => {
    dispatch(fetchAssets(selectedAsset));

    // Poll every 20s
    const interval = setInterval(() => {
      console.log("Refreshing data...");
      dispatch(fetchAssets(selectedAsset));
    }, 20000);

    return () => clearInterval(interval);
  }, [dispatch, selectedAsset]);

  useEffect(() => {
    if (status === "succeeded") {
      localStorage.setItem("assets", JSON.stringify(assets));
    }
  }, [status, assets]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(event.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#02276d] to-[#15162c] text-white">
      {status === "loading" && <LoaderOverlay />}
      <div className="container mx-auto p-4 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Assets</h1>
          <div>
            <label htmlFor="asset-select" className="mr-2">
              Select Asset:
            </label>
            <select
              id="asset-select"
              value={selectedAsset}
              onChange={handleSelectChange}
              className="rounded bg-gray-700 p-2"
            >
              <option value="Bitcoin">Bitcoin</option>
              <option value="Ethereum">Ethereum</option>
              <option value="Solana">Solana</option>
              <option value="Dogecoin">Dogecoin</option>
              <option value="Cosmos">Cosmos</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg bg-gray-800 shadow-md">
          <table className="min-w-full rounded-lg bg-gray-800">
            <thead>
              <tr>
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Symbol</th>
                <th className="px-4 py-2 text-center">Price</th>
                <th className="px-4 py-2 text-center">Time</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr
                  key={`asset-data-${asset.name}-${index}`}
                  className="border-t border-gray-700"
                >
                  <td className="px-4 py-2 text-center">{asset.name}</td>
                  <td className="px-4 py-2 text-center">{asset.symbol}</td>
                  <td className="px-4 py-2 text-center">
                    ₹{asset.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(asset.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {status === "failed" && <div>Failed to load assets.</div>}
      </div>
    </main>
  );
};

export default AssetTable;
