"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { invoke } from "@tauri-apps/api/core";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
};

export const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps) => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isCurrentlyPublished, setIsCurrentlyPublished] = useState(isPublished);

    const onClick = async () => {
        setIsLoading(true);
        
        if (isCurrentlyPublished) {
            invoke("unpublish_course", {
                userId,
                courseId
            }).then(() => {
                toast.success("khóa học chưa được xuất bản");
                setIsCurrentlyPublished(false);
            }).catch(err => toast.error(err))
            .finally(() => setIsLoading(false));
        } else {
            invoke("publish_course", {
                userId,
                courseId
            }).then(() => {
                toast.success("Khóa học đã được xuất bản");
                setIsCurrentlyPublished(true);
                confetti.onOpen();
            }).catch(err => toast.error(err))
            .finally(() => setIsLoading(false));
        }
        
        router.refresh();
    }

    const onDelete = async () => {
        setIsLoading(true);
        invoke("delete_course", {
            userId,
            courseId,
        }).then(() => {
            toast.success("Khóa học đã bị xóa!");
            router.push(`/teacher/courses`);
            router.refresh();
            setIsLoading(false);
        }).catch(err => toast.error(err));
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isCurrentlyPublished ? "Chưa được xuất bản" : "Xuất bản khóa học"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}