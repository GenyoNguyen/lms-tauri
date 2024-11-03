import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function PATCH(
    req: Request
) {
    try {
        // const { userId } = auth();
        const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, chapterId } = await req.json();

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: chapterId
            }
        });

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing Required Fields", { status: 400 });
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedChapter);
    } catch (error) {
        console.log("[CHAPTER_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}