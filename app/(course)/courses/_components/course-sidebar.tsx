"use client";

import { Chapter, Course, UserProgress } from "@prisma/client"
import { useRouter } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import axios from "axios";
import { useEffect, useState } from "react";

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[]
    };
    progressCount: number;
};

export const CourseSidebar = ({
    course,
    progressCount
}: CourseSidebarProps) => {
    // // const { userId } = auth();
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const router = useRouter();
    const [purchase, setPurchase] = useState();

    useEffect(() => {
        async function fetchPurchase() {
            const fetchedpurchase = await axios.post("/api/purchase", { userId, courseId: course.id });
            setPurchase(fetchedpurchase.data);
        }

        fetchPurchase();
    }, [course.id])

    if (!userId) {
        router.push("/");
    }


    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
    )
}