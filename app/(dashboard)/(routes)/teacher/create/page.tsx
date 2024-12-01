"use client";

import * as z from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { invoke } from "@tauri-apps/api/core";
import { Course } from "@prisma/client";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Tên khóa học là bắt buộc",
    }),
});

const CreatePage = () => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        invoke<Course>("create_course", {
            userId,
            title: values.title
        }).then(response => {
            router.push(`/teacher/courses/course/?courseId=${response.id}`);
            toast.success("Khóa học đã được tạo!");
            router.refresh();
        }).catch(err => toast.error(err));
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Đặt tên cho khóa học của bạn
                </h1>
                <p className="text-sm text-slate-600">
                    Bạn muốn đặt tên khóa học của mình như thế nào? Đừng lo, bạn có thể thay đổi sau.
                </p>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Tên khóa học
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="ví dụ: 'Phát triển web nâng cao'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Bạn sẽ dạy gì trong khóa học này?
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button
                                    type="button"
                                    variant="ghost"
                                >
                                    Hủy
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Tiếp tục
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreatePage;
