"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import { invoke } from "@tauri-apps/api/core";

interface ImageFormProps {
    initialData: Course;
    courseId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
})

export const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

    const toggleEdit = () => setIsEditting((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(courseId);

        invoke("update_course", {
            courseId,
            updates: values
        }).then(() => {
            toast.success("Course updated");
            toggleEdit();
            setImageUrl(values.imageUrl);
        }).catch(err => toast.error(err));
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditting && (
                        <>Cancel</>
                    )}
                    {!isEditting && !imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add an image
                        </>
                    )}
                    {!isEditting && imageUrl && (
                        <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditting && (
                !imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={imageUrl}
                        />
                    </div>
                )
            )}
            {isEditting && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            console.log(url);
                            console.log("Lmao");
                            if (url) {
                                onSubmit({ imageUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio reccommended
                    </div>
                </div>
            )}
        </div>
    )
}