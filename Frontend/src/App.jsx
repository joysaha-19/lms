import React from 'react';
import StdDash from './student/student_dashboard'
import CoursePage from './course_page/course_page'
import Enrollment from './enrollment/enrollment'
import Teacher from './teacher/teacher_dashboard'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/student" element={<StdDash/>} />
        <Route path="/student/course/:courseId" element={<CoursePage />} />
        <Route path="/student/enroll/:courseId" element={<Enrollment />} />
        <Route path="/teacher" element={<Teacher />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
