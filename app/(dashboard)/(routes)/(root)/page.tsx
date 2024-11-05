"use client";
import React from "react";
import "./page_root.css"
import { CheckCircle, Clock } from "lucide-react";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./_components/info-card";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CourseWithProgressWithCategory } from "@/actions/get-courses";
import toast from "react-hot-toast";

const SquareLoader = () => {
  return (
    <div className="loader">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="loader-square" />
      ))}
    </div>
  );
};

export default function Dashboard() {
  const userId = "user_2n3IHnfFLi6yuQ5GZrtiNlbuMM2"

  const [{ coursesInProgress, completedCourses }, setDashboardCourses] = useState<{
        coursesInProgress: CourseWithProgressWithCategory[],
        completedCourses: CourseWithProgressWithCategory[]
      }>({ coursesInProgress: [], completedCourses: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardCourses() {
      invoke<{
        coursesInProgress: CourseWithProgressWithCategory[],
        completedCourses: CourseWithProgressWithCategory[]
      }>('get_dashboard_courses', {
        userId
      }).then(({coursesInProgress, completedCourses}) => {
        setDashboardCourses({coursesInProgress, completedCourses});
        setIsLoading(false);
      }).catch(err => toast.error(err));
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
          <div className="flex items-center justify-center h-screen mt-10">
            <SquareLoader />
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
      <div className="flex items-center justify-center h-screen mt-10">
        <SquareLoader />
      </div>
    );
  }
}