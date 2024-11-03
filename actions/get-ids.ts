import { db } from "@/lib/db";

export const getAllCourseIds = async () => {
    const courseIds = await db.course.findMany({
        select: {
            id: true
        }
    })

    return courseIds.map(courseId => {
        return{
            courseId: courseId.id
        }
    });
}

export const getAllChapterCourseIds = async () => {
    const courses = await db.course.findMany({
        select: {
            id: true
        }
    });

    const nestedPaths = await Promise.all(courses.map(async course => {
        const chapters = await db.chapter.findMany({
            where: {
                courseId: course.id
            },
            select: {
                courseId: true,
                id: true
            }
        })
        
        const res = chapters.map( chapter => {
            return {
                courseId: chapter.courseId,
                chapterId: chapter.id
            }
        })
        return res
    }));
    return nestedPaths.reduce((accumulator, value) => accumulator.concat(value), []);
}