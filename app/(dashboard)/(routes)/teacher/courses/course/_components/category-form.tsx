"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

import React from "react";
import { invoke } from "@tauri-apps/api/core";

interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string; value: string; }[];
};

const formSchema = z.object({
    categoryId: z.string().min(1)
})

export const CategoryForm = ({
    initialData,
    courseId,
    options
}: CategoryFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");

    const toggleEdit = () => setIsEditting((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: categoryId || ""
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(courseId);

        invoke("update_course", {
            courseId,
            updates: values
        }).then(() => {
            toast.success("Khóa học đã được cập nhật");
            toggleEdit();
            setCategoryId(values.categoryId);
        }).catch(err => toast.error(err));
    }

    const selectedOption = options.find((option) => option.value === categoryId);

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Danh mục khóa học
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditting ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Chỉnh sửa danh mục
                        </>
                    )}
                </Button>
            </div>
            {!isEditting && (
                <p className={cn(
                    "text-sm mt-2",
                    !categoryId && "text-slate-500 italic"
                )}>
                    {selectedOption?.label || "Chưa chọn danh mục"}
                </p>
            )}
            {isEditting && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Lưu
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}