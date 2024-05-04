import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import "./course_page.css";

export default function UI() {
   const [scroller, setScroller] = useState(0);
   const [querycourse, setQueryCourse] = useState({});

   // Extract the courseId parameter from the URL
   const { courseId } = useParams();

   async function fetchCourse(courseId) {
      const encodedCourse = encodeURIComponent(courseId);
      const url = `http://localhost:5000/lms/courses/spcourse?courseid=${encodedCourse}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQueryCourse(data);
      } catch (error) {
        console.error("Could not fetch course:", error);
      }
   }

   useEffect(() => {
      if (courseId) {
        fetchCourse(courseId);
      }
   }, [courseId]); // Dependency array includes courseId to refetch if it changes

   function handleChapterChange(index) {
      const dist = index * 80;
      setScroller(dist);
   }

   return (
    <div className="course_page_parent">
      <div className="course_title_area"><p>{querycourse.course_name}</p></div>
      <div className="course_chapters_area">
        {
          querycourse.chapters?.map((value, index) => (
            <div key={index} className="chapter_option" onClick={() => handleChapterChange(index)}>     
              <p className="chapter_name">{value.name}</p>
            </div>
          ))
        }
        <div className="course_scroller" style={{ transform: `translateY(${scroller}px)` }}></div>
      
      </div>
      <div className="course_page_appbar"></div>
      <div className="course_content_area"></div>
    </div>
  );
}
