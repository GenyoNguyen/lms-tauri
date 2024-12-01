"use client";

import { Categories } from "./_components/categories";


import { redirect, useSearchParams } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { useState, useEffect } from "react";

import { invoke } from "@tauri-apps/api/core";
import { Category, Course } from "@prisma/client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null
};

const SquareLoader = () => (
  <motion.div 
    className="loader grid grid-cols-4 gap-2 w-24 h-24"
    initial={{ opacity: 0.6 }}
    animate={{ 
      opacity: [0.6, 1, 0.6],
      transition: { 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }
    }}
  >
    {[...Array(8)].map((_, index) => (
      <motion.div 
        key={index} 
        className="bg-pastel-dark opacity-50 rounded-sm"
        initial={{ scale: 0.8 }}
        animate={{ 
          scale: [0.8, 1, 0.8],
          transition: { 
            duration: 1.5, 
            delay: index * 0.1,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
    ))}
  </motion.div>
);

const SearchPage = () => {
  const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<CourseWithProgressWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryAndCourses() {
      try {
        // Các tham số tìm kiếm từ URL
        const title = searchParams.get("title")?.toString();
        const categoryId = searchParams.get("categoryId")?.toString();
  
        const fetchedCategories = await invoke<Category[]>("get_categories");
        console.log("Danh mục đã tải:", fetchedCategories);
        setCategories(fetchedCategories);
  
        console.log("Tham số tìm kiếm:", { title, categoryId });
  
        const coursesRes = await invoke<CourseWithProgressWithCategory[]>("get_search", {
          userId,
          title,
          categoryId,
        });
  
        console.log("Các khóa học đã tải:", coursesRes);
  
        setCourses(coursesRes);
        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        toast.error("Không thể tải các khóa học");
        setIsLoading(false);
      }
    }
  
    fetchCategoryAndCourses();
  }, [searchParams]);

  if (!userId) {
    return redirect("/");
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-pastel-blue">
        <SquareLoader />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-pastel-blue to-white py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
      
        {/* Phần Danh mục */}
        <motion.div 
          className="mb-8"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-pastel-dark mb-4">Danh mục khóa học</h2>
          <Categories items={categories} />
        </motion.div>

        {/* Phần Danh Sách Khóa Học */}
        <motion.div 
          className="mb-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-pastel-dark mb-4">
            Có {courses.length} khóa học phù hợp!
          </h2>
          {courses.length > 0 ? (
            <CoursesList items={courses} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">Không có khóa học nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchPage;
