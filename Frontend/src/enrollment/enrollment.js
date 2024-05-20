import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./enrollment.css";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
import AnimationData from "../assets/tick-anim.json";
import Lottie from "react-lottie";



export default function UI() {
  const token=localStorage.getItem("accesstoken");

  const navigate = useNavigate();
  const { courseId,username } = useParams();
  const [querycourse, setQueryCourse] = useState({});
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [buttontext,setbuttontext]=useState('');
  const [loading1,setLoading1]=useState(true);
  const [op,setop]=useState(0);
  const [bgc,setbgc]=useState('');
  const [success,setsuccess]=useState(0);
  const [zindex,setzindex]=useState(0);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: AnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  // const [open,setopen]=useState(false);
  async function fetchCourse(username, courseId) {
    const encodedCourse = encodeURIComponent(courseId);
    const url = `https://lms-joydeep.onrender.com/lms/courses/spcourse?courseid=${encodedCourse}`;

    try {
      const response = await fetch(url,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'username':`${username}`

        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQueryCourse(data);
      setbuttontext(`Pay US$${data["course_cost"]}`)
    } catch (error) {
      console.error("Could not fetch course:", error);
    }finally{
      setLoading1(false);
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchCourse(username, courseId);
    }
  }, [courseId]);  // Dependency array includes courseId to refetch if it changes

  async function handlePay(event) {
    event.preventDefault(); // Prevent the form from being submitted

    // Check if any of the fields are empty
    if (!cardNumber || !cvv || !phoneNumber || !expDate) {
      alert('Please fill all the fields.');
      return;
    }
    
    setop(1);
    setzindex(10);
    // If all fields are filled, handle the payment process
    setbuttontext('Processing payment...');
    const url = `https://lms-joydeep.onrender.com/lms/courses/enroll`;

    try {
      const response = await fetch(url, {
        method: 'POST', // Specify the method as POST
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
          'username':`${username}`

        },
        body: JSON.stringify({
          username: username, // Include the username in the body
          courseId: courseId  // Include the courseId in the body
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }    // Further processing would go here, such as submitting to a server
     
     const a= setTimeout(()=>{
      setsuccess(1);
      setbgc('lightgreen');
      },2000)

      const b= setTimeout(()=>{
        navigate(`/student/course/${username}/${courseId}`);
        },4500)

  }catch (error) {
    console.error("Could not fetch course:", error);
  }
}
if (loading1) {
  return <div className="loading">Loading course info...</div>;
}
  return (
    <div className="enrollment_parent">
      <div className="cover" style={{opacity:op,zIndex:zindex}}>     
       <div className="enrollment-checkbox" style={{backgroundColor:bgc}}>{success?            <Lottie
              options={defaultOptions}
              height={150}
              width={150}
              // ref={lottieRef}
            />:<p>Enrolling...</p>}</div>
</div>
      <div className="course_details_area">
      <div className="exitbutton" style={{left:'2%',top:'5%'}} onClick={() => navigate(`/student/${username}`)}>
          <p>EXIT</p>
        </div>        <div className="course_details_box">
          <div className="course_name">{querycourse["course_name"]}</div>
          <div className="course_cost">US${querycourse["course_cost"]}</div>
          <div className="course_instructor">By{" "} {querycourse["course_instructor"]}</div>
        </div>
      </div>
      <section className="container">
        <header>Payment Form</header>
        <form action="#" className="form" onSubmit={handlePay}>
          <div className="input-box">
            <label>Credit/Card Number</label>
            <input type="text" placeholder="Enter number" required value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
          </div>
          <div className="input-box">
            <label>CVV</label>
            <input type="text" placeholder="Enter CVV" required value={cvv} onChange={(e) => setCvv(e.target.value)} />
          </div>
          <div className="column">
            <div className="input-box">
              <label>Phone Number</label>
              <input type="number" placeholder="Enter phone number" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div className="input-box">
              <label>Date of Expiration</label>
              <input type="month" required value={expDate} onChange={(e) => setExpDate(e.target.value)} />
            </div>
            <div className="input-box">
              <label>Customer Name</label>
              <input type="text" value={username} readOnly />
            </div>
          </div>
          
          <button type="submit" >{buttontext}</button>
        </form>
      </section>
    </div>
  );
}
