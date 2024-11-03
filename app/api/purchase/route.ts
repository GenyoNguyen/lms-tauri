import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId, courseId } = await req.json();

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: courseId
            }
        }
    });

    return NextResponse.json(purchase);
}