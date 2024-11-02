import { getCourses } from "@/actions/get-courses";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId, title, categoryId } = await req.json();

    const coursesWithProgress = await getCourses({userId, title, categoryId});

    if (!coursesWithProgress) {
        return new NextResponse("Internal Error", { status: 500 });
    }

    return NextResponse.json(coursesWithProgress);
}