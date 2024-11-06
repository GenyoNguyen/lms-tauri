"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
};

export const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished
}: ChapterActionsProps) => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const searchParams = new URLSearchParams();
    searchParams.set("courseId", courseId);
    searchParams.set("chapterId", chapterId);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isCurrentlyPublished, setIsCurrentlyPublished] = useState(isPublished);

    const onClick = async () => {
        setIsLoading(true);
        
        if (isCurrentlyPublished) {
            invoke("unpublish_chapter", {
                userId,
                courseId,
                chapterId
            }).then(() => {
                toast.success("Chapter unpublished");
                setIsCurrentlyPublished(false);
            }).catch(err => toast.error(err))
            .finally(() => setIsLoading(false));
        } else {
            invoke("publish_chapter", {
                userId,
                courseId,
                chapterId
            }).then(() => {
                toast.success("Chapter published");
                setIsCurrentlyPublished(true);
            }).catch(err => toast.error(err))
            .finally(() => setIsLoading(false));
        }
    }

    const onDelete = async () => {
            setIsLoading(true);

            invoke("delete_chapter", {
                userId,
                courseId,
                chapterId
            }).then(() => {
                toast.success("Chapter deleted");
                router.push(`/teacher/courses/course?courseId=${courseId}`);
            }).catch(err => toast.error(err))
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isCurrentlyPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}