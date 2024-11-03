import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const { userId, courseId, chapterId } = await req.json();

    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                }
            }
        });

        const coursePrice = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                price: true
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        });

        if (!chapter || !coursePrice) {
            throw new Error("Chapter or course not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId
                }
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            });
        }
        
        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        }); 

        return NextResponse.json({
            chapter,
            coursePrice,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase
        })
    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return NextResponse.json({
            chapter: null,
            coursePrice: null,
            muxData: null,
            attachments: null,
            nextChapter: null,
            userProgress: null,
            purchase: null
        })
    }
}