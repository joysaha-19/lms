import React from 'react';
import StdDash from './student/student_dashboard';
import CoursePage from './course_page/course_page';
import Enrollment from './enrollment/enrollment';
import Teacher from './teacher/teacher_dashboard';
import Signup from './signup/signup';
import Signin from './signin/signin'
import Unauthorized from './errorpages/unauthorized_access/unauthorized_access';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />

        <Route path="/" element={<Navigate replace to="/signup" />} />
        <Route path="/student/:username" element={<StdDash />} />
        <Route path="/student/course/:username/:courseId" element={<CoursePage />} />
        <Route path="/student/enroll/:username/:courseId" element={<Enrollment />} />
        <Route path="/teacher/:username" element={<Teacher />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
