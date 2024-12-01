"use client";

import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { invoke } from "@tauri-apps/api/core";
import { CldVideoPlayer } from "next-cloudinary";
import 'next-cloudinary/dist/cld-video-player.css';

interface VideoPlayerProps {
    videoId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
};

export const VideoPlayer = ({
    videoId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completeOnEnd
}: VideoPlayerProps) => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnd = async () => {
        if (completeOnEnd) {
            invoke("update_chapter_progress", {
                userId,
                chapterId,
                isCompleted: true
            }).then(() => {
                toast.success("Progress updated");
                if (!nextChapterId) {
                    confetti.onOpen();
                } else {
                    const searchParams = new URLSearchParams();
                    searchParams.set("courseId", courseId);
                    searchParams.set("chapterId", nextChapterId);
                    router.push(`/courses/chapters?${searchParams.toString()}`);
                }
            }).catch(err => toast.error(err));
        }
    }

    return (
        <div className="relative aspect-video">
            {/* {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )} */}
            {isLocked &&(
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">
                        This chapter is locked
                    </p>
                </div>
            )}
            {!isLocked && (

                <CldVideoPlayer
                    src={videoId!}
                    onEnded={onEnd}
                    autoPlay
                />
            )}
        </div>
    )
}