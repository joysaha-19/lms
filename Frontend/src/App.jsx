import React from 'react';
import StdDash from './student/student_dashboard'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/student" element={<StdDash/>} />
        

      </Routes>
    </BrowserRouter>
  );
};

export default App;
