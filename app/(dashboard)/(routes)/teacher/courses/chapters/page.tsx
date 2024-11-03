"use client"

import { IconBadge } from "@/components/icon-badgs";

import { ArrowLeft, Eye, LayoutDashboard, Loader2, Video } from "lucide-react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chapter, MuxData } from "@prisma/client";

const ChapterIdPage = () => {
    // const { userId } = auth();
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";

    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");
    const chapterId = searchParams.get("chapterId");

    const [chapter, setChapter] = useState<{ muxData: MuxData } & Chapter>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchChapter() {
            const fetchedChapter = await axios.post("/api/teacher/chapter", { courseId, chapterId });
            setChapter(fetchedChapter.data);
            setIsLoading(false);
        }
        console.log("Lmao");
        fetchChapter();
    }, [chapterId, courseId])
    
    if (!userId) {
        return redirect("/");
    }

    if (!chapter && !isLoading) {
        return redirect("/");
    }


    if (chapter) {
        const requiredFields = [
            chapter.title,
            chapter.description,
            chapter.videoUrl,
        ]

        const totalFields = requiredFields.length;
        const completedFields = requiredFields.filter(Boolean).length;

        const completionText = `(${completedFields}/${totalFields})`;

        const isComplete = requiredFields.every(Boolean);

        return ( 
            <>
                {!chapter.isPublished && (
                    <Banner
                        variant="warning"
                        label="This chapter is unpublished. It will not be visible in the course."
                    />
                )}
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="w-full">
                            <Link
                                href={`/teacher/courses/course?courseId=${courseId}`}
                                className="flex items-center text-sm hover:opacity-75 transition mb-6"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2"/>
                                Back to course setup
                            </Link>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col gap-y-2">
                                    <h1 className="text-2xl font-medium">
                                        Chapter Creation
                                    </h1>
                                    <span className="text-sm text-slate-700">
                                        Complete all fields {completionText}
                                    </span>
                                </div>
                                <ChapterActions
                                    disabled={!isComplete}
                                    courseId={courseId!}
                                    chapterId={chapterId!}
                                    isPublished={chapter.isPublished}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={LayoutDashboard}/>
                                    <h2 className="text-xl">
                                        Customize your chapter
                                    </h2>
                                </div>
                                <ChapterTitleForm
                                    initialData={chapter}
                                    courseId={courseId!}
                                    chapterId={chapterId!}
                                />
                                <ChapterDescriptionForm
                                    initialData={chapter}
                                    courseId={courseId!}
                                    chapterId={chapterId!}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={Eye}/>
                                    <h2 className="text-xl">
                                        Access Settings
                                    </h2>
                                </div>
                                <ChapterAccessForm
                                    initialData={chapter}
                                    courseId={courseId!}
                                    chapterId={chapterId!}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Video} />
                                <h2 className="text-xl">
                                    Add a video
                                </h2>
                            </div>
                            <ChapterVideoForm
                                initialData={chapter}
                                courseId={courseId!}
                                chapterId={chapterId!}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        <Loader2 className="w-8 h-8 animate-spin"/>
    }
}
 
export default ChapterIdPage;