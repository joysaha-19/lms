import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./teacher_dashboard.css";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';

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
    } catch (error) {
      console.error("Failed to fetch teacher data:", error);
    } finally {
    }
    setLoading1(false);
  }

  useEffect(() => {
    fetchTeacher(username);
  }, []);

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

  function generateYAxisLabels(max) {
    let labels = [];
    for (let i = 0; i <= max; i += 50) {
      labels.push(i);
    }
    return labels;
  }

  if (loading1) {
    return <div className="loading">Loading course info...</div>;
  }
  return (
    <div className="teacher_dashboard_parent">
      <div className="logobox">
        <div className="logoboxactual">
          <img className="logoimage" src="./pics/logo.png" alt="logo"></img>
        </div>
      </div>
      <div className="appbar"></div>
      <div className="teachermenu">
        <div
          className="browseoption"
          style={{ backgroundColor: bgBrowser, color: textBrowser }}
          onClick={() => handleTeacherMenu(0)}
        >
          <p>Analytics</p>
        </div>
        <div
          className="dashboardoption"
          style={{ backgroundColor: bgDashboard, color: textDashboard }}
          onClick={() => handleTeacherMenu(1)}
        >
          <p>Courses</p>
        </div>
        <div
          className="scroller"
          style={{ transform: `translateY(${scroller}px)` }}
        ></div>
      </div>
      <div className="maincontent">
        <div
          className="legend"
          style={{ display: activeMenu ? "none" : "flex" }}
        >
          <div className="greenbox">
            Total Sales:&nbsp;{publishedCourses.length}
            <p></p>
          </div>
          <div className="bluebox">
            Total Revenue:
            <p>
              &nbsp;{totalrevenue}
              {"$"}
            </p>
          </div>
        </div>
        <div
          className="coursestableheader"
          style={{ display: !activeMenu ? "none" : "flex" }}
        >
          <div className="tableheader">
            <div className="header_coursename">Course</div>
            <div className="header_price">Price</div>
            <div className="header_status">Status</div>
            <div className="header_edit"></div>
          </div>
        </div>

        <div className="courselistarea">
          <div
            className="coursecontainer"
            style={{ border: activeMenu ? "none" : "2px solid gray" }}
          >
            <div
              className="chartcontainer"
              style={{ display: activeMenu ? "none" : "flex" }}
            >
              {chart.map((value, index) => {
                if (value["status"] === "published") {
                  return (
                    <div
                      className="chartelement"
                      style={{
                        height: `${
                          (parseFloat(value["revenue"]) / parseFloat(max)) * 100
                        }%`,
                        width: `${95 / chart.length}%`,
                      }}
                    >
                      <div className="charttag">
                        <p>{value["course_name"]}</p>
                      </div>
                    </div>
                  );
                } else {
                  return null; // Return null for non-published courses
                }
              })}

              <div className="yaxis">
                {generateYAxisLabels(max).map((label) => (
                  <div
                    className="ylabel"
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
              className="courselist"
              style={{ display: !activeMenu ? "none" : "flex" }}
            >
              {chart.map((value,index) => {
                return (
                  <div className="tablerow">
                    <div className="header_coursename">{value["course_name"]}</div>
                    <div className="header_price">{value["cost"]}$</div>
                    <div className="header_status"><div style={{background:value["status"]==="published"?"rgb(9, 161, 236)":"lightgrey"}} className="statusbox">{value["status"]}</div></div>
                    <div className="header_edit"><MoreVertTwoToneIcon className="editbutton"></MoreVertTwoToneIcon></div>
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
