import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { Loader2 } from "lucide-react";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({
    items
}: CoursesListProps) => {
    console.log(typeof items);
    console.log(items);
    if (items) {
        return (
            <div>
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <CourseCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            imageUrl={item.imageUrl!}
                            chaptersLength={item.chapters.length}
                            price={item.price!}
                            progress={item.progress}
                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            category={item?.category?.name!}
                        />
                    ))}
                </div>
                {items.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-10">
                        No courses found
                    </div>
                )}
            </div>
        )
    } else {
        return (
            <Loader2 className="w-8 h-8 animate-spin"/>
        )
    }
}