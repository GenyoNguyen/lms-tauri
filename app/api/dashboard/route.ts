import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await req.json();
    const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

    if( !completedCourses.length && !coursesInProgress.length ) {
        return new NextResponse("Internal Error", { status: 500 });
    }

    return NextResponse.json({
        completedCourses,
        coursesInProgress
    })
}