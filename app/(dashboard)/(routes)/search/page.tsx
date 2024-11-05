"use client";

import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { CourseWithProgressWithCategory } from "@/actions/get-courses";

import { redirect, useSearchParams } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { Category } from "@prisma/client";
import toast from "react-hot-toast";

// interface SearchPageProps {
//     searchParams: {
//         title: string;
//         categoryId: string;
//     }
// };

const SearchPage = () => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [courses, setCourses] = useState<CourseWithProgressWithCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCategoryAndCourses() {
            invoke<Category[]>("get_categories").then(categories => setCategories(categories) ).catch(err => toast.error(err));
            

            invoke<CourseWithProgressWithCategory[]>("get_search", {
                userId,
                title: searchParams.get("title")?.toString(),
                categoryId: searchParams.get("categoryId")?.toString()
            }).then(coursesRes => {
                console.log("Lmao");
                console.log(coursesRes);
                setCourses(coursesRes);
                setIsLoading(false);
            }).catch(err => toast.error(err));
        }
        
        fetchCategoryAndCourses();
    }, [searchParams]);

    // const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }

    if (isLoading) {
        return (
            <Loader2 className="w-8 h-8 animate-spin"/>
        )
    } else {
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
}
 
export default SearchPage;