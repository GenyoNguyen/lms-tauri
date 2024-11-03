import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        }
    });

    return NextResponse.json(categories);
}