import React from 'react';
import StdDash from './student/student_dashboard';
import CoursePage from './course_page/course_page';
import Enrollment from './enrollment/enrollment';
import Teacher from './teacher/teacher_dashboard';
import NewCourse from './newcourse/newcourse';
import EditCourse from './editcourse/editcourse';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/student" />} />
        <Route path="/student" element={<StdDash />} />
        <Route path="/student/course/:courseId" element={<CoursePage />} />
        <Route path="/student/enroll/:courseId" element={<Enrollment />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/teacher/addcourse" element={<NewCourse />} />
        <Route path="/teacher/editcourse/:courseId" element={<EditCourse />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
