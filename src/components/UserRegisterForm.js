// Integration file: Auth

import React, { useState } from "react";
import "./css/UserRegisterForm.css";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";


const UserRegisterForm = () => {
  const[username, setUsername] = useState()
  const[isUsernameValid, setIsUsernameValid] = useState(true)

  const[isEmailValid, setIsEmailValid] = useState(true)

  const[isSubmitted, setIsSubmitted] = useState(false)

  function registrationHandler(username, password, email, confirmPassword) {

    setIsSubmitted(true)

    if(username === '') {
      setIsUsernameValid(false)
      return
    }

    var registerJSON = {"username": username, "password": password, "email": email}

    fetch('http://localhost:6001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(registerJSON)
    }).then(response => response.json().then(
      (data) => {
        if(response.status === 403) {
          //error out
          return
        }

        if(response.status === 409) {
          //Custom error codes: 410 for username error, 401 for email error
          data.errorCode === 410 ? setIsUsernameValid(false) : setIsEmailValid(false)
          return
        }

        var requestSuccessDiv = document.getElementById('request-success-div')
        //Show user a message that a verification email has been sent to their account
        document.getElementById('request-success-text-field').innerHTML = "Thank you for signing up! An email has been sent to " + registerJSON.email + " with a " +
                                                                          "confirmation link to activate your account. <a href='/login'>Click here</a> to return to the login page"
        document.getElementById('register-div').hidden = true
        requestSuccessDiv.hidden = false
      }
    ))
  }

  return(
    <>
      <div id="register-div" className="register-div">
        <h1 style={{color: "white"}}>Create account</h1>

        <form id="register-form" className="register-form">
          <label htmlFor="username">Username:</label>
          <br />
          {isSubmitted && (isUsernameValid ? <FaCheckCircle style={{color: 'green'}}/> : <FaRegCircleXmark style={{color: 'red'}}/>)}
          <input type="text" id="username" name="username" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <hr />


          <label htmlFor="email">Email:</label><br />
          <input type="text" id="email" name="email" placeholder="Type your email"/><hr />

          <label htmlFor="password">Password:</label><br />
          <input type="password" id="password" name="password" placeholder="Type your password"/><hr />

          <label htmlFor="confirm-password">Confirm password:</label><br />
          <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password"/><hr />
        </form>

        <button className="submit-button" id='submit-button' onClick={() => registrationHandler(window.document.getElementById('username').value, window.document.getElementById('password').value, window.document.getElementById('email').value, window.document.getElementById('confirm-password').value)}>SIGN UP</button>
      </div>

      <div id="request-success-div" className="request-div" hidden={true}>
        <p id="request-success-text-field"></p>
      </div>
    </>
  )
}

export default UserRegisterForm;
