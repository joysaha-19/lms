import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Video from "../assets/sample_video.mp4";
import SamplePdf from "../assets/sample_assignment.pdf";
import ReactConfetti from 'react-confetti';

import "./course_page.css";

export default function UI() {
  const token = localStorage.getItem("accesstoken");

  const nav = useNavigate();
  const [progresstext,setprogresstext]=useState("Progress updated!")
  const [scroller, setScroller] = useState(0);
  const [querycourse, setQueryCourse] = useState({});
  const [chaptersavailable, setChaptersAvailable] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chaptersdone, setchaptersdone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapternames, setchapternames] = useState([]);
  const [a, setA] = useState(false);
  const confettiRef = useRef(null);
  const [initialcompleted, setinitialcompleted] = useState(false);
  const [confetti, setconfetti] = useState(false);

  const toggleProgress = () => {
    let c = a;
    setA(!c);
    const b = setTimeout(() => {
      setA(a);
      return () => clearTimeout(b);
    }, 3100);
  };

  const videoRef = useRef(null); // Create a ref for the video element

  // Extract the courseId parameter from the URL
  const { courseId, username } = useParams();

  async function fetchCourseData(username, courseId) {
    const encodedCourse = encodeURIComponent(courseId);
    const encodedUsername = encodeURIComponent(username);

    const courseUrl = `https://lms-joydeep.onrender.com/lms/courses/spcourse?courseid=${encodedCourse}`;
    const userCoursesUrl = `https://lms-joydeep.onrender.com/lms/courses/usercourses?username=${encodedUsername}`;

    try {
      const [courseResponse, userCoursesResponse] = await Promise.all([
        fetch(courseUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'username': `${username}`
          }
        }),
        fetch(userCoursesUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'username': `${username}`
          }
        })
      ]);

      if (!courseResponse.ok) {
        if (courseResponse.status === 401) {
          navigate('/unauthorized');
          return;
        }
        throw new Error(`HTTP error! status: ${courseResponse.status}`);
      }

      if (!userCoursesResponse.ok) {
        if (userCoursesResponse.status === 401) {
          navigate('/unauthorized');
          return;
        }
        throw new Error(`HTTP error! status: ${userCoursesResponse.status}`);
      }

      const courseData = await courseResponse.json();
      const userCoursesData = await userCoursesResponse.json();
      const coursedata = userCoursesData[courseId];

      if (coursedata) {
        setchaptersdone(coursedata["chaptersDone"]);
        const allChaptersDone = courseData["chapters"].every(chapter =>
          coursedata["chaptersDone"].includes(chapter.name)
        );
        // Set confetti to true if all chapters are done
        if (allChaptersDone) {
          setconfetti(false);
          setinitialcompleted(true);
          
        }
      }

      const n = courseData["chapters"].length;
      let arr = [];

      if (courseData["enrolled"].includes(username)) {
        // If username is enrolled, fill the array with 1s
        arr = new Array(n).fill(1);
      } else {
        // Only the first value is 1, rest are 0
        arr = [1, ...new Array(n - 1).fill(0)];
      }

      setChaptersAvailable(arr);
      setQueryCourse(courseData);
      setchapternames(courseData["chapters"]);

      
    } catch (error) {
      console.error("Could not fetch course data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (courseId && username) {
      fetchCourseData(username, courseId);
    }
  }, [courseId, username]);

  function handleChapterChange(index) {
    const dist = index * 80;
    setScroller(dist);
    setCurrentChapter(index);
  }

  function handleenroll(a) {
    nav(`/student/enroll/${username}/${a}`);
  }

  async function completeChapter(username, courseId, chapter_name) {
    if (chaptersdone.includes(chapter_name))
      return;

    const postData = {
      username: username,
      courseId: courseId,
      chapter_name: chapter_name,
    };

    try {
      const response = await fetch(
        "https://lms-joydeep.onrender.com/lms/courses/completechapter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
            'username': `${username}`
          },
          body: JSON.stringify(postData),
        }
      );

      if (response.ok) {
        console.log("Successful");
        let abc = [...chaptersdone, chapternames[currentChapter]?.["name"]];
        setchaptersdone(abc);

        toggleProgress();
        const allChaptersDone = chapternames.every(chapter =>
          abc.includes(chapter.name)
        );

        // Set confetti to true if all chapters are done
        if (allChaptersDone && !initialcompleted) {
          setconfetti(true);
          setinitialcompleted(true);
          setprogresstext("Course completed!")
        }
      } else {
        if (response.status === 401) {
          navigate('/unauthorized');
          return;
        }
        throw new Error("Failed to complete chapter");
      }
    } catch (error) {
      console.error("Error completing chapter:", error);
    }
  }

  useEffect(() => {
    // Reset video to the start when currentChapter changes
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [currentChapter]);

  if (loading) {
    return <div className="loading">Loading course info...</div>;
  }

  return (
    <div className="course_page_parent">
      <ReactConfetti
        ref={confettiRef}
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={800}
        wind={0.0}
        gravity={0.1}
        initialVelocityX={5}
        initialVelocityY={5}
        run={confetti}
      />
      <div className="course_title_area">
        <p>{querycourse.course_name}</p>
      </div>
      <div className="course_chapters_area">
        {querycourse.chapters?.map((value, index) => (
          <div
            key={index}
            className="chapter_option"
            onClick={() => handleChapterChange(index)}
          >
            <p
              className="chapter_name"
              style={{
                color:
                  currentChapter === index
                    ? "black"
                    : chaptersdone.includes(value["name"])
                      ? "green"
                      : "lightgray",
              }}
            >
              {!chaptersavailable[index] ? (
                <LockIcon />
              ) : chaptersdone.includes(value["name"]) ? (
                <CheckCircleOutlinedIcon />
              ) : (
                <PlayCircleIcon />
              )}{" "}
              {value.name}
            </p>
          </div>
        ))}
        <div
          className="course_scroller"
          style={{ transform: `translateY(${scroller}px)` }}
        ></div>
      </div>
      <div className="course_page_appbar">
      <div className="progress-box" style={{ animation: a ? 'slideDown 3s ease 0.1s 1 normal backwards' : 'none' }}>{progresstext}</div>
        <div className="exitbutton" onClick={() => nav(`/student/${username}`)}>
          <p>EXIT</p>
        </div>
      </div>
      <div className="course_content_area">
        <div
          className="warningbox"
          style={{
            display: chaptersavailable[currentChapter] ? "none" : "flex",
          }}
        >
          <p>
            You need to purchase the course to be able to access this chapter.
          </p>
        </div>

        <div className="contentarea">
          <div className="chaptervideo">
            <div className="videobox">
              <div
                className="lockedvideo"
                style={{
                  display: chaptersavailable[currentChapter] ? "none" : "flex",
                }}
              >
                <LockIcon />
              </div>
              <video
                ref={videoRef}
                controls
                muted
                width="100%"
                height="90%"
                style={{
                  display: !chaptersavailable[currentChapter] ? "none" : "flex",
                }}
                onEnded={() =>
                  completeChapter(username, courseId, chapternames[currentChapter]?.["name"])
                }
              >
                <source src={Video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              className="enrollmentbutton"
              style={{
                display: !chaptersavailable.includes(0) ? "none" : "flex",
              }}
              onClick={() => handleenroll(courseId)}
            >
              Enroll for ${querycourse["course_cost"]}
            </div>
            <div
              className="markascompletebutton"
              style={{
                display:
                  !chaptersavailable.includes(0) &&
                  !chaptersdone.includes(chapternames[currentChapter]?.["name"])
                    ? "flex"
                    : "none",
              }}
              onClick={() =>
                completeChapter(username, courseId, chapternames[currentChapter]?.["name"])
              }
            >
              Mark as Complete
            </div>
            <div
              className="completedbutton"
              style={{
                display:
                  !chaptersavailable.includes(0) &&
                  chaptersdone.includes(chapternames[currentChapter]?.["name"])
                    ? "flex"
                    : "none",
              }}
            >
              Completed
            </div>
          </div>
          <div className="chapterdescription">
            <div className="objective">
              <p>Objective</p>
            </div>
            <div className="chapter_info">
              <p>{querycourse.chapters?.[currentChapter]?.description || "Loading chapter description..."}</p>
            </div>
            <div className="attachment_link" style={{ display: chaptersavailable.includes(0) ? "none" : "flex" }}>
              <p>Assignment: <a href={SamplePdf} download style={{ color: 'blue', textDecoration: 'underline' }}>
                Download PDF
              </a></p>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
}
