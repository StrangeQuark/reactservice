// Integration file: Auth

import React, { useState } from "react";
import "./css/UserRegisterForm.css";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";


const UserRegisterForm = () => {
  const[username, setUsername] = useState('')
  const[isUsernameValid, setIsUsernameValid] = useState(true)

  const[email, setEmail] = useState('')
  const[isEmailValid, setIsEmailValid] = useState(true)

  const[password, setPassword] = useState('')
  const[isPasswordValid, setIsPasswordValid] = useState(true)

  const[confirmPassword, setConfirmPassword] = useState('')
  const[isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true)

  const[isSubmitted, setIsSubmitted] = useState(false)
  const[isSuccess, setIsSuccess] = useState(false)

  function registrationHandler() {
    setIsSubmitted(true)

    setIsUsernameValid(username !== '')
    setIsEmailValid(email !== '')
    setIsPasswordValid(password !== '')
    setIsConfirmPasswordValid(confirmPassword !== '' && confirmPassword === password)

    const isFormValid =
      username !== '' &&
      email !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      confirmPassword === password;

    if (!isFormValid)
      return;

    var registerJSON = {"username": username, "password": password, "email": email}

    fetch('http://localhost:6001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerJSON),
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 409) {
            const data = await response.json().catch(() => ({}));
            if (data.errorCode === 410) {
              setIsUsernameValid(false);
            } else if (data.errorCode === 401) {
              setIsEmailValid(false);
            }
          }
        } else {
          const data = await response.json();
          setIsSuccess(true);
        }
      })
      .catch((error) => {
        console.error('Network error or unexpected issue:', error);
      });
    
  }

  return(
    <>
      {!isSuccess && (<div id="register-div" className="register-div">
        <h1 style={{color: "white"}}>Create account</h1>

        <form id="register-form" className="register-form">
          <label htmlFor="username">Username:</label>
          <br />
          {isSubmitted && (isUsernameValid ? <FaCheckCircle style={{color: 'green'}}/> : <FaRegCircleXmark style={{color: 'red'}}/>)}
          <input type="text" id="username" name="username" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <hr />


          <label htmlFor="email">Email:</label>
          <br />
          {isSubmitted && (isEmailValid ? <FaCheckCircle style={{color: 'green'}}/> : <FaRegCircleXmark style={{color: 'red'}}/>)}
          <input type="text" id="email" name="email" placeholder="Type your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <hr />

          <label htmlFor="password">Password:</label>
          <br />
          {isSubmitted && (isPasswordValid ? <FaCheckCircle style={{color: 'green'}}/> : <FaRegCircleXmark style={{color: 'red'}}/>)}
          <input type="password" id="password" name="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <hr />

          <label htmlFor="confirm-password">Confirm password:</label>
          <br />
          {isSubmitted && (isConfirmPasswordValid ? <FaCheckCircle style={{color: 'green'}}/> : <FaRegCircleXmark style={{color: 'red'}}/>)}
          <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          <hr />
        </form>

        <button className="submit-button" id='submit-button' onClick={() => registrationHandler()}>SIGN UP</button>
      </div>)}

      {isSuccess && (<div id="request-success-div" className="request-div">
        <p id="request-success-text-field">
          Thank you for signing up! An email has been sent to {email} with a confirmation link to activate your account. <a href="/login">Click here</a> to return to the login page.
        </p>
      </div>)}
    </>
  )
}

export default UserRegisterForm;
