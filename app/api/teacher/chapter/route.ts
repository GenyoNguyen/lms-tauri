import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { chapterId, courseId } = await req.json();

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId
        },
        include: {
            muxData: true,
        },
    });

    return NextResponse.json(chapter);
}