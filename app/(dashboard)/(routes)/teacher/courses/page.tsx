import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const CoursesPage = async () => {
    // const { userId } = auth();
const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";

    if (!userId) {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return ( 
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
     );
}
 
export default CoursesPage;