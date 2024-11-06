"use client";

import { Chapter, Course, Purchase, UserProgress } from "@prisma/client"
import { useRouter } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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
    const [purchase, setPurchase] = useState<Purchase | null>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPurchase() {
            invoke<Purchase | null>("get_purchase", {
                userId,
                courseId: course.id
            }).then(fetchedPurchase => {
                setPurchase(fetchedPurchase);
                setIsLoading(false);
            })
            .catch(err => toast.error(err));
        }

        fetchPurchase();
    }, [course.id])

    if (!userId) {
        router.push("/");
    }

    if (isLoading) {
        return (
            <Loader2 className="w-8 h-8 animate-spin"/>
        )
    } else {
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
}