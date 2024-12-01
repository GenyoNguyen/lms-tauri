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
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";
import { invoke } from "@tauri-apps/api/core";

interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(1),
})

export const ChaptersForm = ({
    initialData,
    courseId
}: ChaptersFormProps) => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [chapters, setChapters] = useState(initialData.chapters);

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(courseId);
        invoke<Chapter[]>("create_chapter", {
            userId,
            courseId,
            title: values.title
        }).then(updated_chapters => {
            toast.success("Course created");
            toggleCreating();
            setChapters(updated_chapters);
        }).catch(err => toast.error(err));
    }

    const onReorder = async (updateData: {id: string, position: number}[]) => {
        setIsUpdating(true);
        invoke<Chapter[]>("reorder_chapters", {
            userId,
            courseId,
            list: updateData
        }).then(reordered_chapters => {
            toast.success("Chapter reordered");
            setChapters(reordered_chapters);
        }).catch(err => toast.error(err))
        .finally(() => setIsUpdating(false));
    }

    const onEdit = (id: string) => {
        const searchParams = new URLSearchParams();
        searchParams.set("courseId", courseId);
        searchParams.set("chapterId", id);
        router.push(`/teacher/courses/chapters?${searchParams.toString()}`);
    }

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Chương học
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Hủy bỏ thao tác</>
                    ) : (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Thêm một chương
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Mô tả về chương học này..."
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
                                Tạo!
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !chapters.length && "text-slate-500 italic"
                )}>
                    {!chapters.length && "Chưa có chương nào"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={chapters}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Kéo và thả để sắp xếp lại các chương
                </p>
            )}
        </div>
    )
}