import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { courseId, userId } = await req.json();

    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                }
            }
        }
    });

    return NextResponse.json(course);
}