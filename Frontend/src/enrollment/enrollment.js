import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./enrollment.css";

export default function UI() {
  const navigate=useNavigate(null);
  const {courseId}= useParams();
  const [querycourse, setQueryCourse] = useState({});

  const username="Joydeep";
  async function fetchCourse(username,courseId) {
    const encodedCourse = encodeURIComponent(courseId);
    const url = `http://localhost:5000/lms/courses/spcourse?courseid=${encodedCourse}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    //   const n = data["chapters"].length;
    //   let arr = [];
      
    //   if (data["enrolled"].includes(username)) {
    //       // If username is enrolled, fill the array with 1s
    //       arr = new Array(n).fill(1);
    //   } else {
    //       // Only the first value is 1, rest are 0
    //       arr = [1, ...new Array(n - 1).fill(0)];
    //   }
      setQueryCourse(data);
    } catch (error) {
      console.error("Could not fetch course:", error);
    }
 }
 useEffect(() => {
    if (courseId) {
      fetchCourse(username,courseId);
    }
 }, [courseId]); // Dependency array includes courseId to refetch if it changes

  return (
    <div className="enrollment_parent">
        <div className="course_details_area">
            <div className="course_details_box">
                <div className="course_name">{querycourse["course_name"]}</div>
                <div className="course_cost">US${querycourse["course_cost"]}</div>
                <div className="course_instructor">Instructor:{" "}{querycourse["course_instructor"]}</div>
            </div>
        </div>
      </div>
  );
}
