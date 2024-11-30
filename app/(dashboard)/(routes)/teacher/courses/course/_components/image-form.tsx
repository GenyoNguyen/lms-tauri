"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Course } from "@prisma/client";
import Image from "next/image";


import { CldUploadWidget } from 'next-cloudinary';
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

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image

                <CldUploadWidget
                    options={{
                        resourceType: "image"
                    }}
                    uploadPreset="ml_default"
                    onClose={() => {
                        setIsEditting(false);
                    }}
                    onSuccess={(result) => {

                        invoke("update_course", {
                            courseId,
                            updates: {"imageUrl": result.info.url}
                        }).then(() => {
                            toast.success("Course updated");
                            setImageUrl(result.info.url);
                            setIsEditting(false);
                        }).catch(err => toast.error(err));

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

                        if (imageUrl) {
                            return (
                                <Button onClick={handleOnClick} variant="ghost">
                                    <Pencil className="h-4 w-4 mr-2"/>
                                    Edit image
                                </Button>
                            );
                        }

                        return (
                            <Button onClick={handleOnClick} variant="ghost">
                                <PlusCircle className="h-4 w-4 mr-2"/>
                                Add an image
                            </Button>
                        );
                    }}
                </CldUploadWidget>

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
                <div>Uploading...</div>
            )}
        </div>
    )
}