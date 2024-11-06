import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId, courseId } = await req.json();

    const course = await db.course.findUnique({
        where: {
            id: courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include: {
                    userProgress: {
                        where: {
                            userId
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    });

    return NextResponse.json(course);
}