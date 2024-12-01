"use client";

import { IconBadge } from "@/components/icon-badgs";

import { CircleDollarSign, File, LayoutDashboard, ListChecks, Loader2 } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
import { useEffect, useState } from "react";
import { Attachment, Category, Chapter, Course } from "@prisma/client";
import { invoke } from "@tauri-apps/api/core";
import toast from "react-hot-toast";

const CourseIdPage = () => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");
    const [course, setCourse] = useState<({chapters: Chapter[], attachments: Attachment[]} & Course)>();
    const [categories, setCategories] = useState<Category[]>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCourse() {

            invoke<({chapters: Chapter[], attachments: Attachment[]} & Course)>("get_teacher_course", {
                userId,
                courseId
            }).then(course => {
                setCourse(course);
            }).catch(err => toast.error(err));
            
            invoke<Category[]>("get_categories").then(categories => {
                setCategories(categories);
                setIsLoading(false);
            }).catch(err => toast.error(err));
        }

        fetchCourse();
    }, [courseId])

    if (!userId) {
        return redirect("/");
    }

    if (!course && !isLoading) {
        return redirect("/");
    }

    if (course && categories) {
        const requiredFields = [
            course.title,
            course.description,
            course.imageUrl,
            course.price,
            course.categoryId,
            course.chapters.some((chapter: { isPublished: boolean; }) => chapter.isPublished),
        ]

        const totalFields = requiredFields.length;
        const completedFields = requiredFields.filter(Boolean).length;

        const completionText = `(${completedFields}/${totalFields})`

        const isComplete = requiredFields.every(Boolean);

        return ( 
            <>
                {!course.isPublished && (
                    <Banner
                        label="Khóa học chưa được xuất bản. Nó có thể không được hiển thị cho học viên."
                    />
                )}
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Chỉnh sửa khóa học
                            </h1>
                            <span className="text-sm text-slate-700">
                                Hoàn thành tất cả các thuộc tính {completionText}
                            </span>
                        </div>
                        <Actions
                            disabled={!isComplete}
                            courseId={courseId!}
                            isPublished={course.isPublished}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard}/>
                                <h2 className="text-xl">
                                    Thiết kế khóa học
                                </h2>
                            </div>
                            <TitleForm
                                initialData={course}
                                courseId={course.id}
                            />
                            <DescriptionForm
                                initialData={course}
                                courseId={course.id}
                            />
                            <ImageForm
                                initialData={course}
                                courseId={course.id}
                            />
                            <CategoryForm
                                initialData={course}
                                courseId={course.id}
                                options={categories.map((category: { name: string; id: string; }) => ({
                                    label: category.name,
                                    value: category.id,
                                }))}
                            />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={ListChecks}/>
                                    <h2 className="text-xl">
                                        Các chương
                                    </h2>
                                </div>
                                <ChaptersForm
                                    initialData={course}
                                    courseId={course.id}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={CircleDollarSign}/>
                                    <h2 className="text-xl">
                                        Bán khóa học
                                    </h2>
                                </div>
                                <PriceForm
                                    initialData={course}
                                    courseId={course.id}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={File}/>
                                    <h2 className="text-xl">
                                        Tệp đính kèm
                                    </h2>
                                </div>
                                <AttachmentForm
                                    initialData={course}
                                    courseId={course.id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <Loader2 className="w-8 h-8 animate-spin"/>
        )
    }
}
 
export default CourseIdPage;