"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Purchase } from "@prisma/client";
import { invoke } from "@tauri-apps/api/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

export const CourseEnrollButton = ({
    price,
    courseId
}: CourseEnrollButtonProps) => {
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        setIsLoading(true);
        invoke<Purchase>("course_checkout", {
            userId,
            courseId
        }).then(() => {
            toast.success("Mua khóa học thành công");
            return router.push("/");
        }).catch(err => {
            toast.error(err);
        }).finally(() => setIsLoading(false));
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            className="w-full md:w-auto"
            size="sm"
        >
            Enroll for {formatPrice(price)}
        </Button>
    )
}