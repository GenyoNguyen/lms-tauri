import { db } from "@/lib/db";

import { NextResponse } from "next/server";


export async function GET() {
    const res = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    });
    return NextResponse.json(res);
}