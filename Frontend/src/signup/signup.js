import React, { useState } from 'react';
import './signup.css';
import Bg from '../assets/bg.jpg';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(''); // State to store server response errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (formData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/lms/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const textResponse = await response.text();
      setServerError(textResponse); // Set error message from server response

      if (!response.ok) {
        return;
      }
      // Handle successful registration scenario, e.g., redirect or clear form
    } catch (error) {
      console.error('Error:', error);
      setServerError('An error occurred while communicating with the server.');
    }
  };

  return (
    <div className="parent_signup" style={{ backgroundImage: `url(${Bg})`, objectPosition: 'left', objectFit: 'cover' }}>
          <div className="lmsimagebox">
                <img alt="lmsimage" src='/pics/logo.png'></img>
            </div>
      <div className="container_signup">
        <div className="title_signup">Registration for Students</div>
        <div className="content_signup">
          <form onSubmit={handleSubmit}>
            <div className="user-details_signup">
              <div className="input-box_signup">
                <span className="details_signup">Username</span>
                <input type="text" placeholder="Enter your username" name="username" required onChange={handleInputChange} />
              </div>
              <div className="input-box_signup">
                <span className="details_signup">Email</span>
                <input type="email" placeholder="Enter your Email" name="email" required onChange={handleInputChange} />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>
              <div className="input-box_signup">
                <span className="details_signup">Phone Number</span>
                <input type="text" placeholder="Enter your number" name="phoneNumber" required onChange={handleInputChange} />
              </div>
              <div className="input-box_signup">
                <span className="details_signup">Password</span>
                <input type="password" placeholder="Enter your password" name="password" required onChange={handleInputChange} />
                {errors.password && <div className="error">{errors.password}</div>}
              </div>
              <div className="input-box_signup">
                <span className="details_signup">Confirm Password</span>
                <input type="password" placeholder="Confirm your password" name="confirmPassword" required onChange={handleInputChange} />
                {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
              </div>
            </div>
            {serverError && <div className="server-error" style={{width:'100%', display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{color:serverError==="Registration Successful. Redirecting..."?"green":'red'}}>{serverError}</p></div>}  

            <div className="button_signup">
              <input type="submit" value="Register" />
            </div>
            <div className="additional-options_signup">
              <button type="button" className="signin-btn_signup">Sign in</button>
              <button type="button" className="register-teacher-btn_signup">Register as Teacher</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
