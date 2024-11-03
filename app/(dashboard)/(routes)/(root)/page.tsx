"use client";

import { CoursesList } from "@/components/courses-list";

import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { InfoCard } from "./_components/info-card";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2"

  const [{ coursesInProgress, completedCourses }, setDashboardCourses] = useState({ coursesInProgress: [], completedCourses: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardCourses() {
      const dashboardCourses = await axios.post("/api/dashboard", { userId: userId });
      setDashboardCourses(dashboardCourses.data);
      setIsLoading(false);
    }
    fetchDashboardCourses();
  }, []);

  if (coursesInProgress && completedCourses) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={Clock}
            label="In progress"
            numberOfItems={coursesInProgress.length}
          />
          <InfoCard
            icon={CheckCircle}
            label="Completed"
            numberOfItems={completedCourses.length}
            variant="success"
          />
        </div>
        {isLoading ? (
          <div className="mt-10 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <CoursesList
            items={[...coursesInProgress, ...completedCourses]}
          />
        )}
      </div>
    );
  } else {
    return (
      <Loader2 className="w-8 h-8 animate-spin"/>
    )
  }
}