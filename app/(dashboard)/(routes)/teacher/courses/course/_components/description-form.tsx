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
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
import { invoke } from "@tauri-apps/api/core";

interface DescriptionFormProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required",
    }),
})

export const DescriptionForm = ({
    initialData,
    courseId
}: DescriptionFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const [description, setDescription] = useState(initialData?.description || "");

    const toggleEdit = () => setIsEditting((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(courseId);

        invoke("update_course", {
            courseId,
            updates: values
        }).then(() => {
            toast.success("Course updated");
            toggleEdit();
            setDescription(values.description);
        }).catch(err => toast.error(err));
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Mô tả khóa học
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditting ? (
                        <>Hủy bỏ thao tác</>
                    ) : (
                        <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Chỉnh sửa mô tả
                        </>
                    )}
                </Button>
            </div>
            {!isEditting && (
                <p className={cn(
                    "text-sm mt-2",
                    !description && "text-slate-500 italic"
                )}>
                    {description || "Chưa có mô tả nào"}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="Khóa học này sẽ giúp bạn..."
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
                                Lưu!
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}