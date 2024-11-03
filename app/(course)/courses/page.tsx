"use client";

import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CourseIdPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");
    const [course, setCourse] = useState<Course & { chapters: Chapter[] }>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCourse () {
            const fetchedCourse = await axios.post("/api/courses/course", { courseId });
            setCourse(fetchedCourse.data);
            setIsLoading(false);
        }
        fetchCourse();
    }, [courseId])

    if (!course && !isLoading) {
        return router.push("/");
    }

    if (course) {
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