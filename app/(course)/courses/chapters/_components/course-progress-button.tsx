"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { invoke } from "@tauri-apps/api/core";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
}

export const CourseProgressButton = ({
    chapterId,
    courseId,
    isCompleted,
    nextChapterId
}: CourseProgressButtonProps) => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isCurrentlyCompleted, setIsCurrentlyCompleted] = useState(isCompleted);

    const onClick = async () => {
            setIsLoading(true);
            invoke("update_chapter_progress", {
                userId,
                chapterId,
                isCompleted: !isCurrentlyCompleted
            }).then(() => {
                setIsCurrentlyCompleted(!isCurrentlyCompleted)
                if (!isCurrentlyCompleted && !nextChapterId) {
                    confetti.onOpen();
                }
                if (!isCurrentlyCompleted && nextChapterId) {
                    const searchParams = new URLSearchParams();
                    searchParams.set("courseId", courseId);
                    searchParams.set("chapterId", nextChapterId);
                    router.push(`/courses/chapters?${searchParams.toString()}`);
                }
                toast.success("Progress updated");
            }).catch(err => toast.error(err))
            .finally(() => setIsLoading(false));
    }

    const Icon = isCompleted ? XCircle : CheckCircle;
    
    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCurrentlyCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            {isCurrentlyCompleted ? "Not completed" : "Mark as completed"}
            <Icon className="h-4 w-4 ml-2" />
        </Button>
    )
}