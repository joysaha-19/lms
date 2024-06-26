import React, { useState } from 'react';
import './signin.css';
import Bg from '../assets/bg.jpg';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const nav=useNavigate();
  const [formData, setFormData] = useState({
    username: '',
   
    password: '',
  
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(''); // State to store server response errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim()
    });
  };

 

  const handleSubmit = async (e) => {
    const username= formData.username
    console.log("here")
    e.preventDefault();
    // if (Object.keys(formErrors).length > 0) {
    //   setErrors(formErrors);
    //   return;
    // }

    try {
      console.log('Sending request with:', formData);
const response1 = await fetch('https://lms-joydeep.onrender.com/lms/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: formData.username.trim(),
    password: formData.password.trim(),
  })
});
// console.log('Received response:', response1);

const jsonResponse = await response1.json();  // Make sure 'response1' is the response object from fetch
const textResponse1 = jsonResponse["message"];

// Access 'accesstoken' correctly if it's part of the JSON response
      
      if (!response1.ok) {
        setServerError(textResponse1)
        return;
      }
      const accesstoken = jsonResponse["accesstoken"].toString();

        localStorage.setItem("accesstoken",accesstoken);
        console.log(accesstoken);
        setServerError("Logged in Successfully! Redirecting...");
        const a =setTimeout(()=>{
            nav(`/student/${username}`);
            return ()=>clearTimeout(a);
        },2000)
      // Handle successful registration scenario, e.g., redirect or clear form
    } catch (error) {
      console.log('Error:', error);
      setServerError('An error occurred while communicating with the server.');
    }
  };

  return (
    <div className="parent_signup" style={{ backgroundImage: `url(${Bg})`, objectPosition: 'left', objectFit: 'cover' }}>
          <div className="lmsimagebox">
                <img alt="lmsimage" src='/pics/logo.png'></img>
            </div>
      <div className="container_signup">
        <div className="title_signup">Login Portal</div>
        <div className="content_signup">
          <form onSubmit={handleSubmit}>
            <div className="user-details_signup">
             
              <div className="input-box_signup">
                <span className="details_signup">Username</span>
                <input type="text" placeholder="Enter your username" name="username" required onChange={handleInputChange} />
              </div>
             
            
              <div className="input-box_signup">
                <span className="details_signup">Password</span>
                <input type="password" placeholder="Enter your password" name="password" required onChange={handleInputChange} />
                {errors.password && <div className="error">{errors.password}</div>}
              </div>
              
            </div>
            {serverError && <div className="server-error" style={{width:'100%', display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{color:serverError==="Logged in Successfully! Redirecting..."?"green":'red'}}>{serverError}</p></div>}  

            <div className="button_signup">
              <input type="submit" value="Login" />
            </div>
            <div className="additional-options_signup">
              <button type="button" className="signin-btn_signup" onClick={()=>nav('/signup')}>Sign up</button>
              {/* <button type="button" className="register-teacher-btn_signup">Register as Teacher</button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
