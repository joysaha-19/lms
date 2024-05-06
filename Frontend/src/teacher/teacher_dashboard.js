import React, { useEffect, useState ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import "./teacher_dashboard.css";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
export default function UI() {
  const navigate = useNavigate(null);
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [draftCourses, setDraftCourses] = useState([]);
  const [courseid, setcourseid] = useState();
  const [activeMenu, setActiveMenu] = useState(1);
  const [bgDashboard, setBgDashboard] = useState("rgba(106, 191, 233, 0.289)");
  const [bgBrowser, setBgBrowser] = useState("white");
  const [textDashboard, setTextDashboard] = useState("rgb(10, 124, 166)");
  const [textBrowser, setTextBrowser] = useState("gray");
  const [scroller, setScroller] = useState(50);
  const [pendingcourses, setpendingcourses] = useState(0);
  const [completecourses, setcompletecourses] = useState(0);
  const [progressbars, setprogressbars] = useState({});
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [totalrevenue, setTotalRevenue] = useState(0);
  const [chart, setchart] = useState([]);
  const [max, setmax] = useState(0);
  const [max1,setmax1] =useState(99999999999999);
  function handlenavigate(a) {
    // Use template literals to dynamically create the path
    console.log(a);
    navigate(`/teacher/course/${a}`);
  }

  const username = "Joydeep";
  async function fetchTeacher(username) {
    const encodedUsername = encodeURIComponent(username);
    const url = `http://localhost:5000/lms/teachers/getteacher?username=${encodedUsername}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      let s = 0;
      let localMax = 0;
      let newChart = [];
      let newChart1 = [];
      setPublishedCourses(data["published_courses"]);
      setDraftCourses(data["published_courses"]);
      const courseFetchPromises = data["published_courses"].map(
        async (courseId) => {
          const encodedCourseid = encodeURIComponent(courseId);
          const courseResponse = await fetch(
            `http://localhost:5000/lms/courses/spcourse?courseid=${encodedCourseid}`
          );
          const courseData = await courseResponse.json();
          const enrolled = courseData["enrolled"].length;
          const revenue = enrolled * courseData["course_cost"];
          s += revenue;
          localMax = Math.max(localMax, revenue);
          return {
            course_name: courseData["course_name"],
            enrolled: enrolled,
            revenue: revenue,
            status: "published",
            cost: courseData["course_cost"]
          };
        }
      );

      newChart = await Promise.all(courseFetchPromises);

      const courseFetchPromises1 = data["draft_courses"].map(
        async (courseId) => {
          const encodedCourseid = encodeURIComponent(courseId);
          const courseResponse = await fetch(
            `http://localhost:5000/lms/courses/spcourse?courseid=${encodedCourseid}`
          );
          const courseData = await courseResponse.json();
          return {
            course_name: courseData["course_name"],
            status: "drafted",
            cost: courseData["course_cost"]

          };
        }
      );

      newChart1 = await Promise.all(courseFetchPromises1);
      let a = [...newChart, ...newChart1];

      setTotalRevenue(s);
      setchart(a);
      setmax(localMax);
      // setTimeout(()=>{
      //   setmax1(localMax);
      //   return()=>clearTimeout(a);
      // },3000)
      
    } catch (error) {
      console.error("Failed to fetch teacher data:", error);
    } finally {
    }
    setLoading1(false);
  }

  useEffect(() => {
    fetchTeacher(username);
    

  }, []);
  
  useEffect(()=>{
   if(activeMenu===1)
    setmax1(999999999);
  else{
    const a=setTimeout(()=>{
      setmax1(max);
      return()=>clearTimeout(a);
    },200);
  
  }
  },[activeMenu])

  function handleTeacherMenu(index) {
    if (index === activeMenu) return;
    setActiveMenu(index);
    if (index === 0) {
      setBgBrowser("rgba(106, 191, 233, 0.289)");
      setBgDashboard("white");
      setTextBrowser("rgb(10, 124, 166)");
      setTextDashboard("gray");
      setScroller(0);
    } else {
      setBgBrowser("white");
      setBgDashboard("rgba(106, 191, 233, 0.289)");
      setTextBrowser("gray");
      setTextDashboard("rgb(10, 124, 166)");
      setScroller(50);
    }
  }
  
  const [filterText, setFilterText] = useState('');

  

  function generateYAxisLabels(max) {
    let labels = [];
    for (let i = 0; i <= max; i += 50) {
      labels.push(i);
    }
    return labels;
  }
  function handleFilterChange(event) {
    setFilterText(event.target.value);
  }
  
  if (loading1) {
    return <div className="loading">Loading course info...</div>;
  }
  return (
    <div className="teacher_dashboard_parent">
      <div className="teacher_logobox">
        <div className="teacher_logoboxactual">
          <img className="logoimage" src="./pics/logo.png" alt="logo" />
        </div>
      </div>
      <div className="teacher_appbar"></div>
      <div className="teacher_teachermenu">
        <div
          className="teacher_browseoption"
          style={{ backgroundColor: bgBrowser, color: textBrowser }}
          onClick={() => handleTeacherMenu(0)}
        >
          <p>Analytics</p>
        </div>
        <div
          className="teacher_dashboardoption"
          style={{ backgroundColor: bgDashboard, color: textDashboard }}
          onClick={() => handleTeacherMenu(1)}
        >
          <p>Courses</p>
        </div>
        <div
          className="teacher_scroller"
          style={{ transform: `translateY(${scroller}px)` }}
        ></div>
      </div>
      <div className="teacher_maincontent">
        <div
          className="teacher_legend"
          style={{ display: activeMenu ? "none" : "flex" }}
        >
          <div className="teacher_greenbox">
            Total Sales:&nbsp;{publishedCourses.length}
          </div>
          <div className="teacher_bluebox">
            Total Revenue:
            <p>&nbsp;{totalrevenue}$</p>
          </div>
        </div>
        <div className="teacher_filterbox" style={{ display: !activeMenu ? "none" : "flex" }}>
        <input className="teacher_filtertext" type="text" value={filterText} onChange={handleFilterChange} placeholder="Filter courses..." />
</div>
<div className="newcoursebutton" style={{ display: !activeMenu ? "none" : "flex" }}><p>{<AddCircleOutlineOutlinedIcon></AddCircleOutlineOutlinedIcon>}{" New Course"}</p></div>

        <div
          className="teacher_coursestableheader"
          style={{ display: !activeMenu ? "none" : "flex" }}
        >
          <div className="teacher_tableheader">
            <div className="teacher_header_coursename">Course</div>
            <div className="teacher_header_price">Price</div>
            <div className="teacher_header_status">Status</div>
            <div className="teacher_header_edit"></div>
          </div>
        </div>

        <div className="teacher_courselistarea">
          <div
            className="teacher_coursecontainer"
            style={{ border: activeMenu ? "none" : "2px solid gray" }}
          >
            <div
              className="teacher_chartcontainer"
              style={{ display: activeMenu ? "none" : "flex" }}
            >
              {chart.map((value, index) => {
                if (value["status"] === "published") {
                  return (
                    <div
                      className="teacher_chartelement"
                      style={{
                        height: `${(parseFloat(value["revenue"]) / parseFloat(max1)) * 100}%`,
                        width: `${95 / chart.length}%`,
                      }}
                    >
                      <div className="teacher_charttag">
                        <p>{value["course_name"]}</p>
                      </div>
                    </div>
                  );
                } else {
                  return null; // Return null for non-published courses
                }
              })}

              <div className="teacher_yaxis">
                {generateYAxisLabels(max).map((label) => (
                  <div
                    className="teacher_ylabel"
                    style={{
                      position: "absolute",
                      bottom: `${(label / max) * 100}%`,
                    }}
                  >
                    {label}$
                  </div>
                ))}
              </div>
            </div>

            <div
              className="teacher_courselist"
              style={{ display: !activeMenu ? "none" : "flex" }}
            >
              {chart.filter(course => course.course_name.toLowerCase().includes(filterText)).map((value, index) => {
                return (
                  <div className="teacher_tablerow">
                    <div className="teacher_header_coursename">{value["course_name"]}</div>
                    <div className="teacher_header_price">{value["cost"]}$</div>
                    <div className="teacher_header_status">
                      <div style={{background: value["status"] === "published" ? "rgb(9, 161, 236)" : "lightgrey"}} className="teacher_statusbox">
                        {value["status"]}
                      </div>
                    </div>
                    <div className="teacher_header_edit">
                      <EditOutlinedIcon  className="teacher_editbutton"  />
                     
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
