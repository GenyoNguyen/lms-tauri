"use client"

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Course } from "@prisma/client";
import { invoke } from "@tauri-apps/api/core";
import toast from "react-hot-toast";

const CoursesPage = () => {
    // const { userId } = auth();
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const [isEditting, setIsEditting] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        async function fetchCourse() {

            invoke<Course[]>("list_courses", {
                userId
            }).then(courses => {
                setCourses(courses);
            }).catch(err => toast.error(err))
            .finally(() => setIsEditting(false));
            
        }

        fetchCourse();
    }, [])

    if (!userId) {
        return redirect("/");
    }

    return (
        <>
            {isEditting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <div className="p-6">
                    <DataTable columns={columns} data={courses} />
                </div>
            )}
        </>
    );
}
 
export default CoursesPage;