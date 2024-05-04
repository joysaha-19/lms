import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./enrollment.css";

export default function UI() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [querycourse, setQueryCourse] = useState({});
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expDate, setExpDate] = useState('');

  const username = "Joydeep";

  async function fetchCourse(username, courseId) {
    const encodedCourse = encodeURIComponent(courseId);
    const url = `http://localhost:5000/lms/courses/spcourse?courseid=${encodedCourse}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQueryCourse(data);
    } catch (error) {
      console.error("Could not fetch course:", error);
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchCourse(username, courseId);
    }
  }, [courseId]);  // Dependency array includes courseId to refetch if it changes

  function handlePay(event) {
    event.preventDefault(); // Prevent the form from being submitted

    // Check if any of the fields are empty
    if (!cardNumber || !cvv || !phoneNumber || !expDate) {
      alert('Please fill all the fields.');
      return;
    }
    
    // If all fields are filled, handle the payment process
    console.log('Processing payment...');
    // Further processing would go here, such as submitting to a server
  }

  return (
    <div className="enrollment_parent">
      <div className="course_details_area">
        <div className="course_details_box">
          <div className="course_name">{querycourse["course_name"]}</div>
          <div className="course_cost">US${querycourse["course_cost"]}</div>
          <div className="course_instructor">Instructor: {querycourse["course_instructor"]}</div>
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
          
          <button type="submit">Pay US${querycourse["course_cost"]}</button>
        </form>
      </section>
    </div>
  );
}s
