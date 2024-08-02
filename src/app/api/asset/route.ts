import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { Asset } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const assetName = searchParams.get("asset");
  let data: Asset[] = [];
  if (assetName) {
    data = await db.asset.findMany({
      where: {
        name: assetName,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 20,
    });
  }
  if (data) {
    return NextResponse.json(
      { message: "Successfully fetched data", data: data },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
