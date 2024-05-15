import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Lottie from "react-lottie";

import "./newcourse.css";

import "./teacher_dashboard.css";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import UploadIcon from "@mui/icons-material/Upload";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Delete from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgress } from "@mui/material";

import AnimationData from "../assets/tick-anim.json";

export default function UI() {
  const [refresher, setRefresher] = useState(0);
  const [windowIndex, setWindowIndex] = useState(0);
  const navigate = useNavigate(null);
  const { username } = useParams();

  const [publishedCourses, setPublishedCourses] = useState([]);
  const [draftCourses, setDraftCourses] = useState([]);
  const [activeMenu, setActiveMenu] = useState(1);
  const [bgDashboard, setBgDashboard] = useState("rgba(106, 191, 233, 0.289)");
  const [bgBrowser, setBgBrowser] = useState("white");
  const [textDashboard, setTextDashboard] = useState("rgb(10, 124, 166)");
  const [textBrowser, setTextBrowser] = useState("gray");
  const [scroller, setScroller] = useState(50);
 
  const [loading1, setLoading1] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chart, setChart] = useState([]);
  const [max, setMax] = useState(0);
  const [max1, setMax1] = useState(99999999999999);
  const [refreshData, setRefreshData] = useState(false);
  const [teacherId, setTeacherId] = useState("");
  const token = localStorage.getItem("accesstoken");
  const [open, setOpen] = useState(false);
  const [finalDialogOpen, setFinalDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // State for new course creation
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCost, setCourseCost] = useState("");
  const [chapters, setChapters] = useState([]);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [completedFields, setCompletedFields] = useState(0);
  const [dialogText, setDialogText] = useState("Publishing...");
  const [finalDialogText, setFinalDialogText] = useState("");

  // State for editing course
  const [editingCourse, setEditingCourse] = useState({});
  const [editingcoursestatus,seteditingcoursestatus]=useState("published")
  const [editing_course_id,setediting_course_id]=useState("");
  const handleClickOpen = (index) => {
    setDeleteCandidate(chart[index]);
    setOpen(true);
  };

  const handleClose = () => {
    setPublishDialogOpen(false);
    setOpen(false);
  };

  async function handleDelete() {
    if (!deleteCandidate) return;

    const { course_id, status } = deleteCandidate;
    const url =
      status === "published"
        ? "http://localhost:5000/lms/courses/deletepublishedcourse"
        : "http://localhost:5000/lms/courses/deletedraftedcourse";

    const body = JSON.stringify({
      courseid: course_id,
      teacherid: teacherId,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          username: `${username}`,
        },
        body: body,
      });

      if (response.ok) {
        console.log("Course deletion successful:", await response.json());
        setChart((currentChart) =>
          currentChart.filter((c) => c.course_id !== course_id)
        );
        handleClose();
      } else {
        if (response.status === 401) {
          navigate("/unauthorized");
          return;
        }
        throw new Error("Failed to delete the course");
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  }

 

  async function fetchTeacher(username) {
    const encodedUsername = encodeURIComponent(username);
    const url = `http://localhost:5000/lms/teachers/getteacher?username=${encodedUsername}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          username: `${username}`,
        },
      });
      if (response.status === 401) {
        navigate("/unauthorized");
        return;
      }
      const data = await response.json();
      let s = 0;
      let localMax = 0;
      let newChart = [];
      let newChart1=[];
      setPublishedCourses(data["published_courses"]);
      setDraftCourses(data["drafted_courses"]);
      setTeacherId(data["_id"]);

      const courseFetchPromises = data["published_courses"].map(
        async (courseId) => {
          const encodedCourseId = encodeURIComponent(courseId);
          const courseResponse = await fetch(
            `http://localhost:5000/lms/courses/spcourse?courseid=${encodedCourseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                username: `${username}`,
              },
            }
          );
          if (courseResponse.status === 401) {
            navigate("/unauthorized");
            return;
          }
          const courseData = await courseResponse.json();
          const enrolled = courseData["enrolled"].length;
          const revenue = enrolled * courseData["course_cost"];
          const chapterList = courseData["chapters"];
          s += revenue;
          localMax = Math.max(localMax, revenue);
          return {
            course_name: courseData["course_name"],
            enrolled: enrolled,
            revenue: revenue,
            status: "published",
            cost: courseData["course_cost"],
            course_id: courseData["_id"],
            chapters: chapterList,
            tag: courseData["tag"],
          };
        }
      );

      newChart = await Promise.all(courseFetchPromises);

      const courseFetchPromises1 = data["drafted_courses"].map(
        async (courseId) => {
          const encodedCourseId = encodeURIComponent(courseId);
          const courseResponse = await fetch(
            `http://localhost:5000/lms/courses/spdraftcourse?courseid=${encodedCourseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                username: `${username}`,
              },
            }
          );
          if (courseResponse.status === 401) {
            navigate("/unauthorized");
            return;
          }
          const courseData = await courseResponse.json();
          const enrolled = courseData["enrolled"].length;
          const chapterList = courseData["chapters"];
          return {
            course_name: courseData["course_name"],
            enrolled: enrolled,
            revenue: 0,
            status: "drafted",
            cost: courseData["course_cost"],
            course_id: courseData["_id"],
            chapters: chapterList,
            tag: courseData["tag"],
          };
        }
      );

      newChart1 = await Promise.all(courseFetchPromises1);

      let a = [...newChart, ...newChart1];

      setTotalRevenue(s);
      setChart(a);
      console.log(a);
      setMax(localMax);
    } catch (error) {
      console.error("Failed to fetch teacher data:", error);
    } finally {
      setLoading1(false);
    }
  }

  useEffect(() => {
    fetchTeacher(username);
  }, [username, refreshData, refresher]);

  useEffect(() => {
    fetchTeacher(username);
    if (activeMenu === 1) setMax1(999999999);
    else {
      const a = setTimeout(() => {
        setMax1(max);
        return () => clearTimeout(a);
      }, 200);
    }
  }, [activeMenu]);

  function handleTeacherMenu(index) {
    if (index === activeMenu) return;
    setActiveMenu(index);
    if (index === 0) {
      setBgBrowser("rgba(106, 191, 233, 0.289)");
      setBgDashboard("white");
      setTextBrowser("rgb(10, 124, 166)");
      setTextDashboard("gray");
      setScroller(0);
      setWindowIndex(0);
    } else {
      setBgBrowser("white");
      setBgDashboard("rgba(106, 191, 233, 0.289)");
      setTextBrowser("gray");
      setTextDashboard("rgb(10, 124, 166)");
      setScroller(50);
      setWindowIndex(0);
    }
  }

  const [filterText, setFilterText] = useState("");

  function generateYAxisLabels(max) {
    let labels = [];
    for (let i = 0; i <= max; i += 100) {
      labels.push(i);
    }
    return labels;
  }
  function handleFilterChange(event) {
    setFilterText(event.target.value);
  }

  ///////////////////////////////////////////////////////////////////NEW COURSE/////////////////////////////////////////////////////////////////
const [errorparam,seterrorparam]=useState(false);




  const [addingChapter, setAddingChapter] = useState(false);
  const [newChapterName, setNewChapterName] = useState("");
  const [newChapterDescription, setNewChapterDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editCourseTitle, setEditCourseTitle] = useState(false);
  const [editCourseDescription, setEditCourseDescription] = useState(false);
  const [editCourseCost, setEditCourseCost] = useState(false);




  const resetFieldsToOriginalState = () => {
    setAddingChapter(false);
    setNewChapterName("");
    setNewChapterDescription("");
    setEditingIndex(-1);
    setEditCourseTitle(false);
    setEditCourseDescription(false);
    setEditCourseCost(false);
    setFinalDialogOpen(false);
    setWindowIndex(0);
    setCourseDescription("");
    setCourseTitle("");
    setChapters([]);
    setCompletedFields(0);
    setCourseCost(0);
    setImage("");
    setDialogText("");
    setPublishDialogOpen(false);
    
  };



  const submitCourse = async () => {
    if (completedFields < 5) {
      alert("All fields are mandatory");
      return;
    }
    const courseData = {
      course_name: courseTitle,
      tag: courseDescription,
      course_instructor: username,
      course_cost: Number(courseCost),
      enrolled: [],
      teacherid: teacherId,
      chapters: chapters,
    };

    try {
      setPublishDialogOpen(true);
      setDialogText("Publishing your course....");
      const response = await fetch(
        "http://localhost:5000/lms/courses/addcourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            username: `${username}`,
          },
          body: JSON.stringify(courseData),
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        console.log("Course added successfully:", responseData);
        setRefresher((prev) => prev + 1);

        setFinalDialogText(
          `Your course ${courseTitle} has been published succussfully!`
        );
        const b = setTimeout(() => {
          setPublishDialogOpen(false);
          setFinalDialogOpen(true);
        }, 2000);
        const a = setTimeout(() => {
        resetFieldsToOriginalState();
        }, 4000);

        return () => {
          clearTimeout(b);
          clearTimeout(a);
        };
      } else {
        if (response.status === 401) {
          navigate("/unauthorized");
          return;
        }
        if(response.status===619)
          {
            seterrorparam(true);
            setDialogText("A course by that name has already been drafted by you.");
            return ;
          }
          if(response.status===618)
            {
              seterrorparam(true);
              setDialogText("A course by that name has already been published by you.");
              return ;
            }
        setDialogText("Failed to save changes. Please try again later.");
        seterrorparam(true);
        console.error("Failed to add course:", responseData);
      }
    } catch (error) {
      console.error("Failed to send course data:", error);
    }
  };

  const publishdraftedcourse = async () => {
    if (completedFields < 5) {
      alert("All fields are mandatory");
      return;
    }
    const courseData = {
      course_name: courseTitle,
      tag: courseDescription,
      course_instructor: username,
      course_cost: Number(courseCost),
      enrolled: [],
      teacherid: teacherId,
      chapters: chapters,
      course_id:editing_course_id
    };

    try {
      setPublishDialogOpen(true);
      setDialogText("Publishing course....");
      const response = await fetch(
        "http://localhost:5000/lms/courses/publishdraftedcourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            username: `${username}`,
          },
          body: JSON.stringify(courseData),
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        console.log("Course published successfully:", responseData);
        setRefresher((prev) => prev + 1);

        setFinalDialogText(
          `Your course ${courseTitle} has been published succussfully!`
        );
        const b = setTimeout(() => {
          setPublishDialogOpen(false);
          setFinalDialogOpen(true);
        }, 2000);
        const a = setTimeout(() => {
          resetFieldsToOriginalState();

        }, 4000);

        return () => {
          clearTimeout(b);
          clearTimeout(a);
        };
      } else {
        if (response.status === 401) {
          navigate("/unauthorized");
          return;
        }
        // if(response.status===619)
        //   {
        //     seterrorparam(true);
        //     setDialogText("A course by that name has already been drafted by you.");
        //     return ;
        //   }
          if(response.status===618)
            {
              seterrorparam(true);
              setDialogText("A course by that name has already been published by you.");
              return ;
            }
        setDialogText("Failed to save changes. Please try again later.");
        seterrorparam(true);
        console.error("Failed to add course:", responseData);
      }
    } catch (error) {
      console.error("Failed to send course data:", error);
    }
  };

  const addToDraft = async () => {
    if (completedFields < 5) {
      alert("All fields are mandatory");
      return;
    }
    const courseData = {
      course_name: courseTitle,
      tag: courseDescription,
      course_instructor: username,
      course_cost: Number(courseCost),
      enrolled: [],
      teacherid: teacherId,
      chapters: chapters,
    };

    try {
      setPublishDialogOpen(true);
      setDialogText("Drafting course....");
      const response = await fetch(
        "http://localhost:5000/lms/courses/addtodraft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            username: `${username}`,
          },
          body: JSON.stringify(courseData),
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        console.log("Course added successfully:", responseData);
        setRefresher((prev) => prev + 1);

        setFinalDialogText(
          `Your course ${courseTitle} has been drafted succussfully!`
        );
        const b = setTimeout(() => {
          setPublishDialogOpen(false);
          setFinalDialogOpen(true);
        }, 2000);
        const a = setTimeout(() => {
          resetFieldsToOriginalState();

        }, 4000);

        return () => {
          clearTimeout(b);
          clearTimeout(a);
        };
      } else {
        if (response.status === 401) {
          navigate("/unauthorized");
          return;
        }
        if(response.status===619)
          {
            seterrorparam(true);
            setDialogText("A course by that name has already been drafted by you.");
            return ;
          }
          if(response.status===618)
            {
              seterrorparam(true);
              setDialogText("A course by that name has already been published by you.");
              return ;
            }
        setDialogText("Failed to save changes. Please try again later.");
        seterrorparam(true);
        console.error("Failed to add course:", responseData);
      }
    } catch (error) {
      console.error("Failed to send course data:", error);
    }
  };



  useEffect(() => {
    const fieldsFilled = [
      courseTitle !== "",
      courseDescription !== "",
      courseCost !== "",
      image !== null,
      chapters.length > 1,
    ];
    setCompletedFields(fieldsFilled.filter(Boolean).length);
  }, [courseTitle, courseDescription, courseCost, image, chapters]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickIcon = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEditClick = (setter) => {
    setter(true);
  };

  const handleDoneClick = (setter) => {
    setter(false);
  };

  function handleAddOrEditChapter(action) {
    if (action === "add") {
      const newChapter = {
        name: newChapterName,
        description: newChapterDescription,
      };
      setChapters([...chapters, newChapter]);
    } else if (action === "edit") {
      const updatedChapters = chapters.map((item, index) =>
        index === editingIndex
          ? {
              ...item,
              name: newChapterName,
              description: newChapterDescription,
            }
          : item
      );
      setChapters(updatedChapters);
    }
    setNewChapterName("");
    setNewChapterDescription("");
    setAddingChapter(false);
    setEditingIndex(-1);
  }

  function handleEditChapter(index) {
    setAddingChapter(true);
    setEditingIndex(index);
    setNewChapterName(chapters[index].name);
    setNewChapterDescription(chapters[index].description);
  }

  function handleChapterInfoClick(index) {
    setAddingChapter(true);
    setNewChapterName(chapters[index].name);
    setNewChapterDescription(chapters[index].description);
  }

  function handleDeleteChapter(index) {
    const updatedChapters = chapters.filter((_, idx) => idx !== index);
    setChapters(updatedChapters);

    if (index === editingIndex) {
      setAddingChapter(false);
      setEditingIndex(-1);
      setNewChapterName("");
      setNewChapterDescription("");
    }
  }

  function moveChapterUp(index) {
    if (index === 0) return;
    const newChapters = [...chapters];
    [newChapters[index], newChapters[index - 1]] = [
      newChapters[index - 1],
      newChapters[index],
    ];
    setChapters(newChapters);
  }

  function moveChapterDown(index) {
    if (index === chapters.length - 1) return;
    const newChapters = [...chapters];
    [newChapters[index], newChapters[index + 1]] = [
      newChapters[index + 1],
      newChapters[index],
    ];
    setChapters(newChapters);
  }

  function truncateText(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  const noChapters = (
    <div className="no_chapters">No chapters have been added</div>
  );

  const addChapters = (
    <div className="add_chapter_box">
      <div className="add_chapter_area">
        <div className="add_chapters_title">
          <p>Add Chapters (min 2)</p>
        </div>
        <div className="chapter_controls_box">
          <div
            className="add_chapter_button"
            style={{ display: !addingChapter ? "flex" : "none" }}
            onClick={() => {
              setAddingChapter(true);
            }}
          >
            <AddCircleOutlineIcon />
            &nbsp;<p>Add chapter</p>
          </div>
          <div
            className="cancel_button"
            style={{ display: addingChapter ? "flex" : "none" }}
            onClick={() => {
              setAddingChapter(false);
              setNewChapterName("");
              setNewChapterDescription("");
            }}
          >
            <p>Cancel</p>
          </div>
          <div
            className="add_button"
            style={{ display: addingChapter ? "flex" : "none" }}
            onClick={() => handleAddOrEditChapter(editingIndex !== -1 ? "edit" : "add")}
          >
            <p>{editingIndex !== -1 ? "Save" : "Add"}</p>
          </div>

          <div
            className="title_text_box"
            style={{ display: addingChapter ? "flex" : "none" }}
          >
            <input
              className="title_text"
              type="text"
              placeholder="E.g.: Introduction"
              value={newChapterName}
              onChange={(e) => setNewChapterName(e.target.value)}
            />
            <div className="boxtag">Chapter Title</div>
          </div>
          <div
            className="title_description_box"
            style={{ display: addingChapter ? "flex" : "none" }}
          >
            <textarea
              className="title_text"
              type="text"
              placeholder="In this chapter, we will..."
              style={{ resize: "none" }}
              value={newChapterDescription}
              onChange={(e) => setNewChapterDescription(e.target.value)}
            ></textarea>
            <div className="boxtag">Chapter Objective</div>
          </div>
        </div>
      </div>

      <div className="added_chapters_area">
        <div className="added_chapters_container">
          {chapters.length ? (
            chapters.map((chapter, index) => (
              <div className="added_chapter_box" key={index}>
                <div className="navigate_box">
                  <div className="upbox" onClick={() => moveChapterUp(index)}>
                    <ArrowUpwardIcon />
                  </div>
                  <div
                    className="downbox"
                    onClick={() => moveChapterDown(index)}
                  >
                    <ArrowDownwardIcon />
                  </div>
                </div>
                <div
                  className="added_chapter_info"
                  onClick={() => handleChapterInfoClick(index)}
                >
                  <div className="added_chapter_name">
                    <p>{truncateText(chapter.name, 40)}</p>
                  </div>
                </div>
                <div className="edit_delete_box">
                  <div
                    className="editbox"
                    onClick={() => handleEditChapter(index)}
                  >
                    <EditIcon />
                  </div>
                  <div
                    className="deletebox"
                    onClick={() => handleDeleteChapter(index)}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no_chapters">No chapters have been added</div>
          )}
        </div>
      </div>
    </div>
  );

  const inputStyle = (editable) => ({
    cursor: editable ? "text" : "not-allowed",
    color: editable ? "black" : "gray",
  });

  const handleSelectChange = (e) => {
    setCourseDescription(e.target.value);
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: AnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  function handleExit() {
    resetFieldsToOriginalState();
    setWindowIndex(0);
    seterrorparam(false);
  }

  ////////////////////////////////////////////////////////////////////////////EDIT COURSE////////////////////////////////////////////////////////////////////
  
  function handleEditWindow(course) {
    setEditingCourse(course);
    setediting_course_id(course["course_id"]);
    setChapters(course["chapters"]);
    setCourseDescription(course["tag"]);
    setCourseCost(course["cost"]);
    setCourseTitle(course["course_name"]);
    setImage("/pics/logo.webp");
    setWindowIndex(2);
    seteditingcoursestatus(course["status"])
  }

  const submitCourseForEdit = async () => {
    if (completedFields < 5) {
      alert("All fields are mandatory");
      return;
    }
    setPublishDialogOpen(true);
    const courseData = {
      course_id: editingCourse["course_id"],
      course_name: courseTitle,
      course_desc: "",
      course_cost: Number(courseCost),
      chapters: chapters,
      tag: courseDescription,
      teacherid:teacherId
    };
    const url=editingCourse["status"] === "published"
    ? "http://localhost:5000/lms/courses/editpublishedcourse"
    : "http://localhost:5000/lms/courses/editdraftedcourse";

    try {
      setPublishDialogOpen(true);
      setDialogText("Applying changes to your course");
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            username: `${username}`,
          },
          body: JSON.stringify(courseData),
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        console.log("Course added successfully:", responseData);
        setRefresher((prev) => prev + 1);

        setFinalDialogText(`Changes saved successfully!`);
        const b = setTimeout(() => {
          setPublishDialogOpen(false);
          setFinalDialogOpen(true);
        }, 2000);
        const a = setTimeout(() => {
          resetFieldsToOriginalState();

        }, 4000);

        return () => {
          clearTimeout(b);
          clearTimeout(a);
        };
      }else {
        if (response.status === 401) {
          navigate("/unauthorized");
          return;
        }
        if(response.status===619)
          {
            seterrorparam(true);
            setDialogText("A course by that name has already been drafted by you.");
            return ;
          }
          if(response.status===618)
            {
              seterrorparam(true);
              setDialogText("A course by that name has already been published by you.");
              return ;
            }
        setDialogText("Failed to save changes. Please try again later.");
        seterrorparam(true);
        console.error("Failed to add course:", responseData);
      }
    } catch (error) {
      console.error("Failed to send course data:", error);
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const newCourseWindow = (
    <div className="newcourse_parent">
      <Dialog open={publishDialogOpen} sx={{ color: "green" }}>
        <DialogContent
         
            sx={{
              minHeight: "50px",
              minWidth: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "16px",
              flexDirection: "column",
            }}
          >
            <div>
              <p style={{ fontSize: "25px", textAlign: "center" }}>
                {dialogText}
              </p>
            </div>
        
        </DialogContent>
        <DialogActions sx={{display:errorparam?'flex':'none'}}>
          <Button onClick={handleExit}>Exit</Button>
          <Button onClick={()=>{setDialogText("");setPublishDialogOpen(false);seterrorparam(false)}} autoFocus>
            Try Again
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={finalDialogOpen} sx={{ color: "green" }}>
        <DialogContent
         
            sx={{
              minHeight: "90px",
              minWidth: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "16px",
              flexDirection: "column",
            }}
          >
            <div>
              <p style={{ fontSize: "25px", textAlign: "center" }}>
                {finalDialogText}
              </p>
            </div>
            <Lottie
              options={defaultOptions}
              height={150}
              width={150}
              isStopped={true}
            />
        </DialogContent>
      </Dialog>
      <div className="leftpanel">
        <div className="newcourse_titlebox">
          <div className="newcourse_title_container">
            <p>New Course Setup</p>
            <p style={{ fontSize: "14px", textAlign: "left" }}>
              Completed Fields: {completedFields}/5
            </p>
          </div>
        </div>
        <div className="newcourse_namebox">
          <div className="newcourse_namebox_title">
            <p>Course Title</p>
          </div>
          <div className="newcourse_name_textbox">
            <input
              className="course_name_text"
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              readOnly={!editCourseTitle}
              style={inputStyle(editCourseTitle)}
              placeholder="Enter Course Title"
            />
            {editCourseTitle ? (
              <DoneIcon
                className="tickicon"
                onClick={() => handleDoneClick(setEditCourseTitle)}
              />
            ) : (
              <EditIcon
                className="editicon"
                onClick={() => handleEditClick(setEditCourseTitle)}
              />
            )}
          </div>
        </div>
        <div className="newcourse_descriptionbox">
          <div className="newcourse_namebox_title">
            <p>Course Tag</p>
          </div>
          <div className="newcourse_description_textbox">
            <select
              className="course_description_text"
              value={courseDescription}
              onChange={handleSelectChange}
              style={{ width: "90%", height: "35px" }}
            >
              <option value="">None</option>
              <option value="Engineering">Engineering</option>
              <option value="Art">Art</option>
              <option value="Medical">Medical</option>
              <option value="Science">Science</option>
              <option value="Humanities">Humanities</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="Architecture">Architecture</option>
            </select>
          </div>
        </div>
        <div className="newcourse_imagebox">
          <div className="newcourse_namebox_title">
            <p>Course Thumbnail</p>
          </div>
          <div className="newcourse_image_area">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            {!image && (
              <div style={{ textAlign: "center" }}>
                Upload thumbnail here
                <UploadIcon className="uploadicon" onClick={handleClickIcon} />
              </div>
            )}
            {image && (
              <>
                <img
                  src={image}
                  alt="Uploaded"
                  style={{
                    width: "400px",
                    height: "200px",
                    objectFit: "contain",
                  }}
                />
                <UploadIcon className="tickicon" onClick={handleClickIcon} />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="rightpanel">
        <div className="newcourse_chapterbox">{addChapters}</div>
        <div className="newcourse_cost">
          <div className="newcourse_namebox_title">
            <p>Course Cost in $</p>
          </div>
          <div className="newcourse_name_textbox" style={{ bottom: "25%" }}>
            <input
              className="course_name_text"
              type="number"
              value={courseCost}
              onChange={(e) => setCourseCost(e.target.value)}
              readOnly={!editCourseCost}
              style={inputStyle(editCourseCost)}
              placeholder="Enter cost of course in $"
            />
            {editCourseCost ? (
              <DoneIcon
                className="tickicon"
                onClick={() => handleDoneClick(setEditCourseCost)}
              />
            ) : (
              <EditIcon
                className="editicon"
                onClick={() => handleEditClick(setEditCourseCost)}
              />
            )}
          </div>
        </div>
        <div className="submitoptions">
          <div className="publishoptionbutton" onClick={submitCourse}>
            Publish
          </div>
          <div
            className="publishoptionbutton"
            style={{ position: "absolute", right: "250px" }}
            onClick={addToDraft}
          >
            Save as Draft
          </div>
        </div>
      </div>
    </div>
  );

  const courseListWindow = (
    <div
      className="teacher_maincontent"
      style={{ display: loading1  ? "none" : "grid" }}
    >
      <div
        className="teacher_legend"
        style={{ display: activeMenu ? "none" : "flex" }}
      >
        <div className="teacher_greenbox">
          Total Sales:&nbsp;{publishedCourses.length}
        </div>
        <div className="teacher_bluebox">
          Total Revenue:
          <p>&nbsp;{totalRevenue}$</p>
        </div>
      </div>
      <div
        className="teacher_filterbox"
        style={{ display: !activeMenu ? "none" : "flex" }}
      >
        <input
          className="teacher_filtertext"
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Search courses..."
        />
      </div>
      <div
        className="newcoursebutton"
        style={{ display: !activeMenu ? "none" : "flex" }}
        onClick={() => setWindowIndex(1)}
      >
        <p>
          {<AddCircleOutlineOutlinedIcon></AddCircleOutlineOutlinedIcon>}
          {" New Course"}
        </p>
      </div>

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
                      height: `${
                        (parseFloat(value["revenue"]) / parseFloat(max1)) * 100
                      }%`,
                      width: `${95 / chart.length}%`,
                      backgroundColor: value["revenue"] === 0 ? "red" : "",
                    }}
                  >
                    <div className="teacher_charttag">
                      <p>{value["course_name"]}</p>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}

            <div className="teacher_yaxis">
              {generateYAxisLabels(max).map((label) => (
                <div
                  className="teacher_ylabel"
                  style={{
                    position: "absolute",
                    bottom: `${(label / max) * 95}%`,
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
           {chart
  .filter((course) =>
    course.course_name && course.course_name.toLowerCase().includes(filterText.toLowerCase())
  )
              .map((value, index) => {
                return (
                  <div className="teacher_tablerow">
                    <div className="teacher_header_coursename">
                      {value["course_name"]}
                    </div>
                    <div className="teacher_header_price">{value["cost"]}$</div>
                    <div className="teacher_header_status">
                      <div
                        style={{
                          background:
                            value["status"] === "published"
                              ? "rgb(9, 161, 236)"
                              : "lightgrey",
                        }}
                        className="teacher_statusbox"
                      >
                        {value["status"]}
                      </div>
                    </div>
                    <div className="teacher_header_edit">
                      <EditOutlinedIcon
                        className="teacher_editbutton"
                        onClick={() => handleEditWindow(value)}
                      />
                      <Delete
                        className="teacher_deletebutton"
                        onClick={() => handleClickOpen(index)}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );

  const editCourseWindow = (
    <div className="newcourse_parent">
      <Dialog open={publishDialogOpen} sx={{ color: "green" }}>
        <DialogContent
        
            sx={{
              minHeight: "50px",
              minWidth: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "16px",
              flexDirection: "column",
            }}
          >
            <div>
              <p style={{ fontSize: "25px", textAlign: "center" }}>
                {dialogText}
              </p>
            </div>
        </DialogContent>
        <DialogActions sx={{display:errorparam?'flex':'none'}}>
          <Button onClick={handleExit}>Exit</Button>
          <Button onClick={()=>{setDialogText("");setPublishDialogOpen(false);seterrorparam(false)}} autoFocus>
            Try Again
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={finalDialogOpen} sx={{ color: "green" }}>
        <DialogContent
            sx={{
              minHeight: "90px",
              minWidth: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "16px",
              flexDirection: "column",
            }}
          >
            <div>
              <p style={{ fontSize: "25px", textAlign: "center" }}>
                {finalDialogText}
              </p>
            </div>
            <Lottie
              options={defaultOptions}
              height={150}
              width={150}
              isStopped={true}
            />
        </DialogContent>
        
      </Dialog>
      <div className="leftpanel">
        <div className="newcourse_titlebox">
          <div className="newcourse_title_container">
            <p>Edit Course</p>
            <p style={{ fontSize: "14px" }}>Completed Fields:{completedFields}/5</p>
          </div>
        </div>
        <div className="newcourse_namebox">
          <div className="newcourse_namebox_title"><p>Course Title</p></div>
          <div className="newcourse_name_textbox">
            <input
              className="course_name_text"
              type="text"
              value={courseTitle}
              onChange={e => setCourseTitle(e.target.value)}
              readOnly={!editCourseTitle}
              style={inputStyle(editCourseTitle)}
              placeholder="Enter Course Title"
            />
            {editCourseTitle ? (
              <DoneIcon className="tickicon" onClick={() => handleDoneClick(setEditCourseTitle)} />
            ) : (
              <EditIcon className="editicon" onClick={() => handleEditClick(setEditCourseTitle)} />
            )}
          </div>
        </div>
        <div className="newcourse_descriptionbox">
          <div className="newcourse_namebox_title"><p>Course Tag</p></div>
          <div className="newcourse_description_textbox">
            <select className="course_description_text" value={courseDescription} onChange={handleSelectChange} style={{ width: '90%', height: '35px' }}>
              <option value="">None</option>
              <option value="Engineering">Engineering</option>
              <option value="Art">Art</option>
              <option value="Medical">Medical</option>
              <option value="Science">Science</option>
              <option value="Humanities">Humanities</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="Architecture">Architecture</option>
            </select>
          </div>
        </div>
        <div className="newcourse_imagebox">
          <div className="newcourse_namebox_title"><p>Course Thumbnail</p></div>
          <div className="newcourse_image_area">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            {!image && (
              <div style={{ textAlign: 'center' }}>
                Upload thumbnail here
                <UploadIcon className="uploadicon" onClick={handleClickIcon} />
              </div>
            )}
            {image && (
              <>
                <img src={image} alt="Uploaded" style={{ width: '400px', height: '200px', objectFit: 'contain' }} />
                <UploadIcon className="tickicon" onClick={handleClickIcon} />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="rightpanel">
        <div className="newcourse_chapterbox">{addChapters}</div>
        <div className="newcourse_cost">
          <div className="newcourse_namebox_title"><p>Course Cost in $</p></div>
          <div className="newcourse_name_textbox" style={{ bottom: '25%' }}>
            <input
              className="course_name_text"
              type="number"
              value={courseCost}
              onChange={e => setCourseCost(e.target.value)}
              readOnly={!editCourseCost}
              style={inputStyle(editCourseCost)}
              placeholder="Enter cost of course in $"
            />
            {editCourseCost ? (
              <DoneIcon className="tickicon" onClick={() => handleDoneClick(setEditCourseCost)} />
            ) : (
              <EditIcon className="editicon" onClick={() => handleEditClick(setEditCourseCost)} />
            )}
          </div>
        </div>
        <div className="submitoptions">
          <div className="publishoptionbutton" onClick={submitCourseForEdit}>Save Changes</div>
          <div
            className="publishoptionbutton"
            style={{ position: "absolute", right: "250px" , display:editingcoursestatus==='drafted'?'flex':'none'
          }}
            onClick={publishdraftedcourse}
          >
            Publish Course
          </div>
        </div>
      </div>
    </div>
  );

  const windows = [courseListWindow, newCourseWindow, editCourseWindow];

  return (
    <div className="teacher_dashboard_parent">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {"Are you sure you want to delete this course?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete the course: ${deleteCandidate?.course_name}? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <div className="teacher_logobox">
        <div className="teacher_logoboxactual">
          <img className="logoimage" src="./pics/logo.png" alt="logo" />
        </div>
      </div>
      <div className="teacher_appbar">
        {windowIndex !== 0 ? (
          <div
            className="exitbutton"
            onClick={handleExit}
            style={{ transition: "all 0s" }}
          >
            <p>EXIT</p>
          </div>
        ) : (
          <div
            className="switchoption"
            onClick={() => navigate(`/student/${username}`)}
          >
            {" "}
            <ArrowBackIcon></ArrowBackIcon>&nbsp; Switch to Student Mode
          </div>
        )}
      </div>
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
          <p>My Courses</p>
        </div>
        <div
          className="teacher_scroller"
          style={{ transform: `translateY(${scroller}px)` }}
        ></div>
      </div>
      <div
        className="LoadingArea_student"
        style={{ display: loading1  ? "flex" : "none" }}
      >
        <div className="loading-box">
          <CircularProgress />
          <div className="loading-message">Loading...</div>
        </div>
      </div>

      {!loading1  && windows[windowIndex]}
    </div>
  );
}