import { NextResponse } from "next/server";
import axios from "axios";
import { db } from "~/server/db";

const fetchAssetData = async () => {
  try {
    const reqBody = {
      currency: "INR",
      codes: ["ETH", "BTC", "DOGE", "SOL", "ATOM"],
      sort: "rank",
      order: "ascending",
      offset: 0,
      limit: 0,
      meta: true,
    };
    const response = await axios.request({
      method: "POST",
      url: `${process.env.LIVECOIN_API_URL}/coins/map`,
      data: JSON.stringify(reqBody),
      headers: {
        "content-type": "application/json",
        "x-api-key": String(process.env.LIVECOIN_API_KEY),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// const saveDataToDb = async () => {
//   const data: Array<{
//     name: string;
//     symbol: string;
//     rate: number;
//     code: string;
//     volume: number;
//     delta: Record<string, number>;
//     cap: number;
//   }> = await fetchAssetData();
//   if (data) {
//     const dbData = [];
//     for (const asset of data) {
//       const assetData = {
//         name: asset.name,
//         symbol: asset.symbol ?? "",
//         price: asset.rate,
//         timestamp: new Date(),
//         code: asset.code,
//         meta: {
//           cap: asset.cap,
//           volume: asset.volume,
//           delta: asset.delta,
//         },
//       };
//       dbData.push(assetData);
//     }
//     await db.asset.createMany({ data: dbData });
//     return data;
//   }
// };

export async function GET() {
  try {
    const data: Array<{
      name: string;
      symbol: string;
      rate: number;
      code: string;
      volume: number;
      delta: Record<string, number>;
      cap: number;
    }> = await fetchAssetData();
    if (data) {
      const dbData = [];
      for (const asset of data) {
        const assetData = {
          name: asset.name,
          symbol: asset.symbol ?? "",
          price: asset.rate,
          timestamp: new Date(),
          code: asset.code,
          meta: {
            cap: asset.cap,
            volume: asset.volume,
            delta: asset.delta,
          },
        };
        dbData.push(assetData);
      }
      await db.asset.createMany({ data: dbData });
      return NextResponse.json(
        { message: "Asset data saved" },
        { status: 200 },
      );
    } else {
      console.log(`Empty data received: ${data}`);
      return NextResponse.json(
        { message: "Failed to fetch data" },
        { status: 500 },
      );
    }
  } catch (e) {
    console.error(`Something went wrong: ${e}`);
    return NextResponse.json(
      { message: "Something went wrong while polling data" },
      { status: 500 },
    );
  }
}

// TODO: move this to cron
// setInterval(saveDataToDb, 10000);
