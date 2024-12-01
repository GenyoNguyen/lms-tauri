"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Chapter } from "@prisma/client";
import { invoke } from "@tauri-apps/api/core";

import { CldUploadWidget, CldVideoPlayer } from "next-cloudinary";
import 'next-cloudinary/dist/cld-video-player.css';

interface ChapterVideoFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
};

export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps) => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const [isEditting, setIsEditting] = useState(false);
    const [videoId, setVideoId] = useState(initialData?.videoId || undefined);

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Video

                <CldUploadWidget
                    options={{
                        clientAllowedFormats: ["mp4", "webm", "ogv", "avi", "mov", "flv"]
                    }}
                    uploadPreset="ml_default"
                    onClose={() => {
                        console.log(videoId)
                        setIsEditting(false);
                    }}
                    onSuccess={(result) => {
                        invoke("update_chapter", {
                            userId,
                            courseId,
                            chapterId,
                            updates: { "videoId": result.info.public_id }
                        }).then(() => {
                            toast.success("Chapter updated");
                            setVideoId(result.info.public_id);
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
                                {videoId ? (
                                    <>
                                        <Pencil className="h-4 w-4 mr-2"/>
                                        Edit video
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="h-4 w-4 mr-2"/>
                                        Add a video
                                    </>
                                )}
                                
                            </Button>
                        )
                    }}
                </CldUploadWidget>

            </div>
            {!isEditting && (
                !initialData.videoId ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <CldVideoPlayer
                            src={videoId!}
                        />
                    </div>
                )
            )}
            {isEditting && (
                <Loader2 className="h-4 w-4 animate-spin" />
            )}

        </div>
    )
}