import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Video from "../assets/sample_video.mp4";
import SamplePdf from "../assets/sample_assignment.pdf"

import "./course_page.css";

export default function UI() {
  const nav = useNavigate(null);
  const [scroller, setScroller] = useState(0);
  const [querycourse, setQueryCourse] = useState({});
  const [chaptersavailable, setChaptersAvailable] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chaptersdone, setchaptersdone] = useState([]);
  const [loading1,setLoading1]=useState(true);
  const [loading2,setLoading2]=useState(true);
  const [chapternames,setchapternames]=useState([]);

  const videoRef = useRef(null); // Create a ref for the video element

  // Extract the courseId parameter from the URL
  const { courseId ,username} = useParams();

  async function fetchCourse(username, courseId) {
    const encodedCourse = encodeURIComponent(courseId);
    const url = `http://localhost:5000/lms/courses/spcourse?courseid=${encodedCourse}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const n = data["chapters"].length;
      let arr = [];

      if (data["enrolled"].includes(username)) {
        // If username is enrolled, fill the array with 1s
        arr = new Array(n).fill(1);
      } else {
        // Only the first value is 1, rest are 0
        arr = [1, ...new Array(n - 1).fill(0)];
      }
      console.log(data["chapters"])
      setChaptersAvailable(arr);
      setQueryCourse(data);
      setchapternames(data["chapters"]);
    } catch (error) {
      console.error("Could not fetch course:", error);
    }finally{
      setLoading1(false);
    }
  }

  async function fetchCoursesForUser(username, courseId) {
    const encodedUsername = encodeURIComponent(username);
    const url = `http://localhost:5000/lms/courses/usercourses?username=${encodedUsername}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const coursedata = data[courseId.toString()];
      setchaptersdone(coursedata["chaptersDone"]);
    } catch (error) {
      console.error("Could not fetch courses:", error);
    }finally{
      setLoading2(false);
    }
  }
  useEffect(() => {
    if (courseId) {
      fetchCourse(username, courseId);
      fetchCoursesForUser(username, courseId);
    }
  }, [courseId]); // Dependency array includes courseId to refetch if it changes

  function handleChapterChange(index) {
    const dist = index * 80;
    setScroller(dist);
    setCurrentChapter(index);
  }

  function handleenroll(a) {
    nav(`/student/enroll/${username}/${a}`);
  }
  async function completeChapter(username, courseId, chapter_name) {
    // Construct the JSON data inside the function
    console.log("here");
    const postData = {
      username: username,
      courseId: courseId,
      chapter_name: chapter_name,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/lms/courses/completechapter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (response.ok) {
        console.log("Successful");
        let abc = [...chaptersdone, chapternames[currentChapter]["name"]];
        setchaptersdone(abc);

        // Additional actions upon success can be handled here
      } else {
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

  if (loading1 || loading2) {
    return <div className="loading">Loading course info...</div>;
  }
  return (
    
    <div className="course_page_parent">
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
                <LockIcon></LockIcon>
              ) : chaptersdone.includes(value["name"]) ? (
                <CheckCircleOutlinedIcon></CheckCircleOutlinedIcon>
              ) : (
                <PlayCircleIcon></PlayCircleIcon>
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
                <LockIcon></LockIcon>
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
                  completeChapter(username, courseId, chapternames[currentChapter]["name"])
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
                  !chaptersdone.includes(chapternames[currentChapter]["name"])
                    ? "flex"
                    : "none",
              }}
              onClick={() =>
                completeChapter(username, courseId, chapternames[currentChapter]["name"])
              }
            >
              Mark as Complete
            </div>
            <div
              className="completedbutton"
              style={{
                display:
                  !chaptersavailable.includes(0) &&
                  chaptersdone.includes(chapternames[currentChapter]["name"])
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
            <div className="chapter_info">
  <p>{querycourse.chapters?.[currentChapter]?.description || "Loading chapter description..."}</p>
</div>
            </div>
            <div className="attachment_link" style={{display: chaptersavailable.includes(0) ? "none" : "flex"}}>
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