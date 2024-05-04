import React from 'react';
import StdDash from './student/student_dashboard'
import CoursePage from './course_page/course_page'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/student" element={<StdDash/>} />
        <Route path="/student/course/:courseId" element={<CoursePage />} />


      </Routes>
    </BrowserRouter>
  );
};

export default App;
