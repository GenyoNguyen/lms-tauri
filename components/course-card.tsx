import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "@/components/icon-badgs";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";

interface CourseCardProps {
    id: string;
    chapterId: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string;
}

export const CourseCard = ({
    id,
    chapterId,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    category
}: CourseCardProps) => {
    const searchParams = new URLSearchParams();
    searchParams.set("courseId", id);
    searchParams.set("chapterId", chapterId);

    return (
        <Link href={`/courses/chapters/?${searchParams.toString()}`}>
            <div className="group hover:scale-105 transition-all overflow-hidden border rounded-xl p-4 h-full shadow-lg hover:shadow-2xl bg-white">
                {/* Image Section */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={title}
                        src={imageUrl}
                    />
                </div>
                
                {/* Course Info */}
                <div className="flex flex-col pt-3 space-y-2">
                    {/* Title */}
                    <div className="text-xl font-semibold text-gray-800 group-hover:text-sky-700 transition-all line-clamp-2">
                        {title}
                    </div>

                    {/* Category */}
                    <p className="text-sm text-gray-500 font-medium">{category}</p>

                    {/* Chapter Info */}
                    <div className="flex items-center gap-x-2 text-sm text-gray-600">
                        <div className="flex items-center gap-x-1">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}</span>
                        </div>
                    </div>

                    {/* Progress or Price */}
                    <div className="mt-2">
                        {progress !== null ? (
                            <CourseProgress
                                variant={progress === 100 ? "success" : "default"}
                                size="sm"
                                value={progress}
                            />
                        ) : (
                            <p className="text-lg font-semibold text-slate-700">{formatPrice(price)}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
