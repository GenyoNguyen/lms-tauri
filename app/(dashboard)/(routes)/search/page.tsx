"use client";

import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { CourseWithProgressWithCategory } from "@/actions/get-courses";

import { redirect, useSearchParams } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { useState, useEffect } from "react";
import axios from "axios";

// interface SearchPageProps {
//     searchParams: {
//         title: string;
//         categoryId: string;
//     }
// };

const SearchPage = () => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [courses, setCourses] = useState<CourseWithProgressWithCategory[]>([]);

    useEffect(() => {
        async function fetchCategoryAndCourses() {
            const response = await axios.get<{ name: string, id: string }[]>("/api/categories");
            setCategories(response.data);

            const coursesRes = await axios.post<CourseWithProgressWithCategory[]>("/api/search", {
                userId,
                title: searchParams.get("title")?.toString(),
                categoryId: searchParams.get("categoryId")?.toString()
            });
            console.log("Lmao");
            console.log(coursesRes.data);
            setCourses(coursesRes.data);
        }
        
        fetchCategoryAndCourses();
    }, [searchParams]);

    // const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }

    return ( 
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories
                    items={categories}
                />
                <CoursesList items={courses} />
            </div>
        </>
     );
}
 
export default SearchPage;