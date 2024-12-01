"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import { invoke } from "@tauri-apps/api/core";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
    url: z.string().min(1),
})

export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const [isEditting, setIsEditting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [attachments, setAttachments] = useState(initialData.attachments);

    const toggleEdit = () => setIsEditting((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(courseId);

        invoke<Attachment[]>("add_attachment", {
            userId,
            courseId,
            url: values.url
        }).then((res) => {
            toast.success("Attachment added");
            toggleEdit();
            setAttachments(res);
        }).catch(err => toast.error(err));
        
    }

    const onDelete = async (id: string) => {
        setDeletingId(id);
        invoke<Attachment[]>("remove_attachment", {
            attachmentId: id,
            userId,
            courseId
        }).then((res) => {
            toast.success("Thư mục đã được xóa");
            toggleEdit();
            setAttachments(res);
            console.log(attachments);
        }).catch(err => toast.error(err))
        .finally(() => {
            setDeletingId(null);
        });
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                    Tệp đính kèm khóa học
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditting && (
                        <>Hủy bỏ thao tác</>
                    )}
                    {!isEditting && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Thêm một file
                        </>
                    )}
                </Button>
            </div>
            {!isEditting && (
                <>
                    {attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            Chưa có tệp đính kèm nào
                        </p>
                    )}
                    {attachments.length > 0 && (
                        <div className="space-y-2">
                            {attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">
                                        {attachment.url}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            className="ml-auto hover:opacity-75 transition"
                                            onClick={() => onDelete(attachment.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditting && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            console.log(url);
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Thêm bất cứ điều gì học viên của bạn có thể cần để hoàn thành khóa học.
                    </div>
                </div>
            )}
        </div>
    )
}