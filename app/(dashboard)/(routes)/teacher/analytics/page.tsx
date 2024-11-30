"use client";

import { redirect } from "next/navigation";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type TeacherAnalytics =  {
    data: { name: string; total: number; }[];
    totalRevenue: number;
    totalSales: number;
}

const AnalyticsPage = () => {
    // const { userId } = auth();
    const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2";
    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState<TeacherAnalytics>({data: [], totalRevenue: 0, totalSales: 0});

    useEffect(() => {
        async function fetchAnalytics() {
            invoke<TeacherAnalytics>("get_teacher_analytics", {
                userId
            }).then(analytic => {
                setAnalytics(analytic);
                setIsLoading(false);
            }).catch(err => toast.error(err));
        }
        fetchAnalytics();
    }, [])

    if (!userId) {
        return redirect("/");
    }

    return (
        <>
        {!isLoading ? ( 
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    label="Total Revenue"
                    value={analytics.totalRevenue}
                    shouldFormat
                />
                <DataCard
                    label="Total Sales"
                    value={analytics.totalSales}
                />
            </div>
            <Chart
                data={analytics.data}
            />
        </div>

        ) : (
            <div>
                <Loader2 className="animate-spin w-4 h-4" />
            </div>
        )}
        </>
    );
}

export default AnalyticsPage;