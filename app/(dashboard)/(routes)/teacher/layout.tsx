import { isTeacher } from "@/lib/teacher";

import { redirect } from "next/navigation";
import React from "react";

const TeacherLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    // const { userId } = auth();
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";

    if (!isTeacher(userId)) {
        return redirect("/");
    }

    return <>{children}</>
}
 
export default TeacherLayout;