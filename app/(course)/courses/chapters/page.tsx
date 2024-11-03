"use client";

import { Banner } from "@/components/banner";

import { useRouter, useSearchParams } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File, Loader2 } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";
import { useEffect, useState } from "react";
import { Attachment, Chapter, Course, MuxData, Purchase, UserProgress } from "@prisma/client";
import axios from "axios";
import CourseLayout from "../_components/course-layout";

interface ChapterDetails {
    chapter: Chapter | null;
    coursePrice: { price: number | null } | null;
    muxData: MuxData | null;
    attachments: Attachment[] | null;
    nextChapter: Chapter | null,
    userProgress: UserProgress | null,
    purchase: Purchase | null;
}

const ChapterIdPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = {
        courseId: searchParams.get("courseId")!,
        chapterId: searchParams.get("chapterId")!
    }

    // const { userId } = auth();
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const [chapterDetails, setChapterDetails] = useState<ChapterDetails>();
    const [course, setCourse] = useState<({
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    } & Course)>();
    const [progressCount, setProgressCount] = useState<number>(0);

    useEffect(() => {
        if (!userId) {
            return router.push("/");
        }
        async function fetchChapterDetails() {
            const fetchedChapterDetails = await axios.post("/api/courses/chapters/chapter", {
                userId,
                courseId: params.courseId,
                chapterId: params.chapterId
            });
            setChapterDetails(fetchedChapterDetails.data);

            const fetchedCourse = await axios.post("/api/courses/course/progress", { userId, courseId: params.courseId });
            setCourse(fetchedCourse.data);

            if(!course) {
                return router.push("/");
            }

            const fetchedProgressCount = await axios.post("/api/courses/course/progress/count", { userId, courseId: params.courseId });
            setProgressCount(fetchedProgressCount.data);
        }
        fetchChapterDetails();
    }, [course, params.chapterId, params.courseId, router])

    

    if (chapterDetails && course) {
        const {
            chapter,
            coursePrice,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase
        } = chapterDetails;

        if (!chapter || !coursePrice) {
            return router.push("/");
        }

        const isLocked = !chapter.isFree && !purchase;
        const completeOnEnd = !!purchase && !userProgress?.isCompleted;
        console.log(purchase)
        return ( 
            <CourseLayout course={course} progressCount={progressCount}>
                <div>
                    {userProgress?.isCompleted && (
                        <Banner
                            variant="success"
                            label="You already completed this chapter."
                        />
                    )}
                    {isLocked && (
                        <Banner
                            variant="warning"
                            label="You need to purchase this course to watch this chapter."
                        />
                    )}
                    <div className="flex flex-col max-w-4xl mx-auto pb-20">
                        <div className="p-4">
                            <VideoPlayer
                                chapterId={params.chapterId}
                                title={chapter.title}
                                courseId={params.courseId}
                                nextChapterId={nextChapter?.id}
                                playbackId={muxData?.playbackId}
                                isLocked={isLocked}
                                completeOnEnd={completeOnEnd}
                            />
                        </div>
                        <div>
                            <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                                <h2 className="text-2xl font-semibold mb-2">
                                    {chapter.title}
                                </h2>
                                {purchase ? (
                                    <CourseProgressButton
                                        chapterId={params.chapterId}
                                        courseId={params.courseId}
                                        nextChapterId={nextChapter?.id}
                                        isCompleted={!!userProgress?.isCompleted}
                                    />
                                ) : (
                                    <CourseEnrollButton
                                        courseId={params.courseId}
                                        price={coursePrice.price!}
                                    />
                                )}
                            </div>
                            <Separator/>
                            <div>
                                <Preview value={chapter!.description!}/>
                            </div>
                            {!!attachments?.length && (
                                <>
                                    <Separator />
                                    <div className="p-4">
                                        {attachments.map((attachment) => (
                                            <a
                                                href={attachment.url}
                                                target="_blank"
                                                key={attachment.id}
                                                className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                            >
                                                <File />
                                                <p className="line-clamp-1">
                                                    {attachment.name}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CourseLayout>
        );
    } else {
        return (
            <div>
                <Loader2 className="w-8 h-8 animate-spin"/>
            </div>
        )
    }
}
 
export default ChapterIdPage;