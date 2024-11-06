"use client";

import { Chapter, Course } from "@prisma/client";
import { invoke } from "@tauri-apps/api/core";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type CourseWithChapters = Course & {
    chapters: Chapter[];
};

const CourseIdPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");
    const [course, setCourse] = useState<CourseWithChapters>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCourse () {

            invoke<CourseWithChapters>("get_course", {
                courseId
            }).then(course => {
                setCourse(course);
                setIsLoading(false);
            }).catch(err => toast.error(err));
        }
        fetchCourse();
    }, [courseId])

    if (!course && !isLoading) {
        return router.push("/");
    }

    if (course && !isLoading) {
        const params = new URLSearchParams();
        params.set("courseId", course.id);
        params.set("chapterId", course.chapters[0].id);
        return router.push(`/courses/chapters?${params.toString()}`);
    } else {
        return (
            <div>
                <Loader2 className="w-8 h-8 animate-spin"/>
            </div>
        )
    }
}
 
export default CourseIdPage;