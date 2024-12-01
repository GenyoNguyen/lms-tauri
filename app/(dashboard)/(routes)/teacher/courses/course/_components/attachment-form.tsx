"use client";

import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Attachment, Course } from "@prisma/client";
import { invoke } from "@tauri-apps/api/core";
import { CldUploadWidget } from "next-cloudinary";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
};

export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const [isEditting, setIsEditting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [attachments, setAttachments] = useState(initialData.attachments);

    const onDelete = async (id: string) => {
        setDeletingId(id);
        invoke<Attachment[]>("remove_attachment", {
            attachmentId: id,
            userId,
            courseId
        }).then((res) => {
            toast.success("Attachment deleted");
            setIsEditting(true);
            setAttachments(res);
            console.log(attachments);
        }).catch(err => toast.error(err))
        .finally(() => {
            setDeletingId(null);
            setIsEditting(false);
        });
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachments

                <CldUploadWidget
                    options={{
                        clientAllowedFormats: ["pdf", "docx"]
                    }}
                    uploadPreset="ml_default"
                    onClose={() => {
                        setIsEditting(false);
                    }}
                    onSuccess={(result) => {
                        invoke<Attachment[]>("add_attachment", {
                            userId,
                            courseId,
                            url: result.info.url
                        }).then((res) => {
                            toast.success("Attachment added");
                            setAttachments(res);
                        }).catch(err => toast.error(err))
                        .finally(() => setIsEditting(false));
                    }}
                    onQueuesEnd={(result, { widget }) => {
                        widget.close();
                    }}
                    >
                    {({ open }) => {
                        function handleOnClick() {
                            setIsEditting(true);
                            open();
                        }

                        if (isEditting) {
                            return (
                                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                            )
                        }

                        return (
                            <Button onClick={handleOnClick} variant="ghost">
                                <PlusCircle className="h-4 w-4 mr-2"/>
                                Add a file
                            </Button>
                        )
                    }}
                </CldUploadWidget>
                
            </div>
                {attachments.length === 0 && (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No attachments yet
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
        </div>
    )
}