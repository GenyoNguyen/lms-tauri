import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "@/components/icon-badgs";
import { BookOpen, Clock, Trophy } from "lucide-react";
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
        <Link href={`/courses/chapters/?${searchParams.toString()}`} className="block">
            <div className="group relative overflow-hidden border-2 border-gray-100 rounded-2xl 
            transition-all duration-300 ease-in-out 
            hover:border-sky-200 hover:shadow-2xl 
            transform hover:-translate-y-2 
            bg-white p-4 h-full">
                {/* Ribbon Category */}
                <div className="absolute top-0 right-0 z-10">
                    <div className="bg-sky-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                        {category}
                    </div>
                </div>

                {/* Image Section */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md mb-4">
                    <Image
                        fill
                        className="object-cover transition-transform duration-500 
                        group-hover:scale-110 brightness-90 group-hover:brightness-100"
                        alt={title}
                        src={imageUrl}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Course Info */}
                <div className="space-y-3">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 
                    group-hover:text-sky-700 transition-colors 
                    line-clamp-2 min-h-[3rem]">
                        {title}
                    </h3>

                    {/* Course Details */}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center gap-x-2">
                            <BookOpen className="w-4 h-4 text-sky-500" />
                            <span>{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}</span>
                        </div>
                        {progress === null && (
                            <div className="flex items-center gap-x-2">
                                <Clock className="w-4 h-4 text-emerald-500" />
                                <span>{formatPrice(price)}</span>
                            </div>
                        )}
                    </div>

                    {/* Progress or Price */}
                    <div className="mt-3">
                        {progress !== null ? (
                            <div className="flex items-center gap-x-2">
                                {progress === 100 ? (
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                ) : null}
                                <CourseProgress
                                    variant={progress === 100 ? "success" : "default"}
                                    size="sm"
                                    value={progress}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-sky-500 
                origin-left scale-x-0 group-hover:scale-x-100 
                transition-transform duration-300"></div>
            </div>
        </Link>
    );
};