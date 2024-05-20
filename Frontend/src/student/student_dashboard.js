import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./student_dashboard.css";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import EngineeringPic from '../assets/engineering.png'
import MedicalPic from '../assets/medical.png'
import ArtPic from '../assets/art.png'
import HumanitiesPic from '../assets/humanities.png'
import BiologyPic from '../assets/biology.png'
import ArchitecturePic from '../assets/architecture.png'
import MathsPic from '../assets/maths.png'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CircularProgress } from "@mui/material";



export default function UI() {
  const imageobj={
    "Engineering":EngineeringPic,
    "Medical":MedicalPic,
    "Art":ArtPic,
    "Humanities":HumanitiesPic,
    "Biology":BiologyPic,
    "Architecture":ArchitecturePic,
    "Mathematics":MathsPic
  }
  const navigate = useNavigate(null);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filterColor, setFilterColor] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [userCourseIds, setUserCourseIds] = useState([]);
  const [activeMenu, setActiveMenu] = useState(0);
  const [bgDashboard, setBgDashboard] = useState("white");
  const [bgBrowser, setBgBrowser] = useState("rgba(106, 191, 233, 0.289)");
  const [textDashboard, setTextDashboard] = useState("gray");                   
  const [textBrowser, setTextBrowser] = useState("rgb(10, 124, 166)");  
  const [scroller, setScroller] = useState(0);
  const [search, setSearch] = useState("");
  const [pendingcourses, setpendingcourses] = useState(0);
  const [completecourses, setcompletecourses] = useState(0);
  const [progressbars,setprogressbars]=useState({});
  const [loading1,setLoading1]=useState(true);
  const [loading2,setLoading2]=useState(true);
  function handlenavigate(a) {
    // Use template literals to dynamically create the path
    console.log(a);
    navigate(`/student/course/${username}/${a}`);
  }
  const { username } = useParams();
  const token=localStorage.getItem("accesstoken");

  async function fetchCoursesForUser(username) {
    const encodedUsername = encodeURIComponent(username);
    const url = `https://lms-joydeep.onrender.com/lms/courses/usercourses?username=${encodedUsername}`;
    try {
      const response = await fetch(url,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'username':`${username}`

        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/unauthorized');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let pending = 0;
      let complete = 0;
      const data = await response.json();
      const fetchedCourses = [];
      const courseIds = [];
      const obj1={};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          courseIds.push(key);
          if (value.chaptersDone.length === value.chapters.length)
            complete = complete + 1;
          else pending = pending + 1;
        
          const progress = parseInt(
            Math.ceil(
              (value.chaptersDone.filter(chapterDone => 
                  value.chapters.some(chapter => chapter.name === chapterDone)).length / value.chapters.length) * 100
            )
          );
          
          obj1[key]=  <div className="cardProgressArea">
          <div className="progressBarArea">
            <div
              className="progressBar"
              style={{
                background:
                  progress < 100
                    ? `linear-gradient(90deg, rgb(29, 153, 202) 0% ${progress}%, white ${
                        progress + 0.1
                      }% 100%)`
                    : `linear-gradient(90deg, green 0% 100%)`,
              }}
            ></div>
          </div>
          <div className="progressValueArea">
            <p
              className="cardProgress"
              style={{ color: progress < 100 ? "rgb(29, 153, 202)" : "green" }}
            >
              {progress}% Complete
            </p>
          </div>
        </div>
          fetchedCourses.push({
            title: value.course_name,
            tag: value.tag,
            chapters: value.chapters.length,
            progress,
            courseid: key,
            image: value["image"]

          });
        }
      }
      setpendingcourses(pending);
      setcompletecourses(complete);
      setCourses(fetchedCourses);
      setUserCourseIds(courseIds);
      console.log("Progress bars set:", obj1);
      setprogressbars(obj1);
          } catch (error) {
      console.error("Could not fetch courses:", error);
    }
    finally{
      setLoading1(false);
    }
  }

  async function fetchAllCourses() {
    const url = `https://lms-joydeep.onrender.com/lms/courses/allcourses`;
    try {
      const response = await fetch(url,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'username':`${username}`

        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/unauthorized');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const fetchedCourses = [];
      const options = [];
      for (const i in data) {
        const value = data[i];
        if (!options.includes(value.tag)) {
          options.push(value.tag);
        }
        fetchedCourses.push({
          title: value.course_name,
          tag: value.tag,
          chapters: value.chapters.length,
          courseid: value._id,
          course_cost: value.course_cost.toString(),
          image: value["image"]
        });
      }

      setAllCourses(fetchedCourses);
      setTagOptions(options);
      setFilterColor(Array(options.length).fill(0));
    } catch (error) {
      console.error("Could not fetch all courses:", error);
    }finally{
      setLoading2(false);
    }
  }

  useEffect(() => {
    fetchCoursesForUser(username);
    fetchAllCourses();
  }, []);

  function handleFilter(index) {
    const newFilterColor = [...filterColor];
    newFilterColor[index] = filterColor[index] === 0 ? 1 : 0;
    setFilterColor(newFilterColor);

    const newFilters = [...filters];
    if (filterColor[index] === 0) {
      newFilters.push(tagOptions[index]);
    } else {
      const filterIndex = newFilters.indexOf(tagOptions[index]);
      if (filterIndex > -1) {
        newFilters.splice(filterIndex, 1);
      }
    }
    setFilters(newFilters);
  }

  function handleStudentMenu(index) {
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

  function CourseCard({ title, tag, chapters, progress, courseid ,image }) {
    return (
      <div
        className="cardParent"
        onClick={(e) => {
          e.stopPropagation(); // Stop the click event from bubbling up
          handlenavigate(courseid);
        }}
      >
        <div className="cardImageArea">
          <img alt="Course logo" src={imageobj[tag]} style={{objectFit:'contain'}}></img>
        </div>
        <div className="cardTitleArea">
          <p className="cardTitle">{title}</p>
          <p className="cardTag">{tag}</p>
        </div>
        <div className="cardChaptersArea">
          <p className="cardChapters">{chapters} chapters</p>
        </div>
        <div className="cardProgressArea">
          <div className="progressBarArea">
            <div
              className="progressBar"
              style={{
                background:
                  progress < 100
                    ? `linear-gradient(90deg, rgb(29, 153, 202) 0% ${progress}%, white ${
                        progress + 0.1
                      }% 100%)`
                    : `linear-gradient(90deg, green 0% 100%)`,
              }}
            ></div>
          </div>
          <div className="progressValueArea">
            <p
              className="cardProgress"
              style={{ color: progress < 100 ? "rgb(29, 153, 202)" : "green" }}
            >
              {progress}% Complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  function GeneralCourseCard({ title, tag, chapters, courseid, course_cost,image }) {
    return (
      <div
  className="cardParent"
  onClick={(e) => {
    e.stopPropagation(); // Stop the click event from bubbling up
    handlenavigate(courseid);
  }}
>
  <div className="cardImageArea">
    <img alt="Course logo" src={imageobj[tag]}></img>
  </div>
  <div className="cardTitleArea">
    <p className="cardTitle">{title}</p>
    <p className="cardTag">{tag}</p>
  </div>
  <div className="cardChaptersArea">
    <p className="cardChapters">{chapters} chapters</p>
  </div>


  {progressbars[courseid]!=null ? (
   

            progressbars[courseid]
            
   
  ) : (
    <div className="EnrollmentStatus">
      <div
        className="EnrollButton"
        style={{
          backgroundColor: !userCourseIds.includes(courseid)
            ? "green"
            : "lightgrey",
        }}
      >
        <p>
          {!userCourseIds.includes(courseid)
            ? `$${course_cost}`
            : "Enrolled"}
        </p>
      </div>
    </div>
  )}
</div>

    );
  }
  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };
  // if (loading1 || loading2) {
  //   return <div className="loading">Loading course info...</div>;
  // }
  return (
    <div className="student_dashboard_parent">
      <div className="appbar">
        <div
          className="searchbox"
          style={{ display: activeMenu ? "none" : "flex" }}
        >
          <input
            type="text"
            id="myTextbox"
            placeholder="Eg: Advanced Algorithms"
            className="searchtextbox"
            value={search}
            onChange={handleInputChange}
          />
        </div>
        <div className="switchoption" onClick={()=>
          navigate(`/teacher/${username}`)
        }>Switch to Teacher Mode &nbsp;<ArrowForwardIcon></ArrowForwardIcon></div>
      </div>
      <div className="logobox">
        <div className="logoboxactual">
        <img className="logoimage" src="./pics/logo.png" alt="logo"></img>
        </div>
      </div>
      
      <div className="studentmenu">
        <div
          className="browseoption"
          style={{ backgroundColor: bgBrowser, color: textBrowser }}
          onClick={() => handleStudentMenu(0)}
        >
          <p>Browse</p>
        </div>
        <div
          className="dashboardoption"
          style={{ backgroundColor: bgDashboard, color: textDashboard }}
          onClick={() => handleStudentMenu(1)}
        >
          <p>Dashboard</p>
        </div>
        <div
          className="scroller"
          style={{ transform: `translateY(${scroller}px)` }}
        ></div>
      </div>
      <div className="LoadingArea_student" style={{display:loading1&&loading2?'flex':'none'}}>
      <div className="loading-box">
          <CircularProgress />
          <div className="loading-message">Loading...</div>
        </div>
  
      </div>
      <div className="maincontent" style={{display:loading1&&loading2?'none':'flex'}}>
     
        <div
          className="tagmenu"
          style={{ display: activeMenu ? "none" : "flex" }}
        >
          {/* <div className="tagoption_empty"></div> */}
          {tagOptions.map((value, index) => (
            <div
              className="tagoption"
              style={{
                backgroundColor:
                  filterColor[index] === 1 ? "rgba(75, 140, 186,0.5)" : "white",
              }}
              onClick={() => handleFilter(index)}
            >
              <p>{value}</p>
            </div>
          ))}
          {/* <div className="tagoption_empty"></div> */}
        </div>

        <div
          className="legend"
          style={{ display: !activeMenu ? "none" : "flex" }}
        >
          <div className="greenbox">
            <CheckCircleOutlinedIcon />
            Completed:
            <p>
              &nbsp;{completecourses}
              {" courses"}
            </p>
          </div>
          <div className="bluebox">
            <AccessTimeOutlinedIcon />
            In Progress:
            <p>
              &nbsp;{pendingcourses}
              {" courses"}
            </p>
          </div>
        </div>
        <div className="coursecardsarea">
          <div className="cardscontainer">
            {activeMenu === 1
              ? courses
                  .filter(
                    (course) =>
                      (filters.length === 0 || filters.includes(course.tag)) &&
                      (search === "" || course.title.includes(search))
                  )
                  .map((course, index) => (
                    <CourseCard key={index} {...course} />
                  ))
              : allCourses
                  .filter(
                    (course) =>
                      (filters.length === 0 || filters.includes(course.tag)) &&
                      (search === "" ||
                        course.title
                          .toLowerCase()
                          .includes(search.toLowerCase()))
                  )
                  .map((course, index) => (
                    <GeneralCourseCard key={index} {...course} />
                  ))}
          </div>
        </div>
      </div>
    </div>
  );
}