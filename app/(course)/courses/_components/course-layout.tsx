"use client";

import { useRouter } from "next/navigation";
import { CourseSidebar } from "./course-sidebar";
import { CourseNavbar } from "./course-navbar";
import { Chapter, Course, UserProgress } from "@prisma/client";

const CourseLayout = ({
    children,
    course,
    progressCount
}: {
    children: React.ReactNode;
    course: ({
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    } & Course);
    progressCount: number;
}) => {
    const router = useRouter();
    // const { isSignedIn, user } = useUser();
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    
    if(!userId) {
        router.push("/");
    }

    return ( 
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
     );
}
 
export default CourseLayout;