import React, { useState, useEffect } from "react";
import "./css/UserRegisterForm.css";

const UserRegisterForm = () => {
  const [errorMessageText, setErrorMessageText] = useState("");
  const [isRequestSuccessVisible, setIsRequestSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const handleEnterKeyPress = (e) => {
      if (e.code === "Enter") {
        document.getElementById("submit-button").click();
      }
    };

    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
      (input) => {
        if (input) {
          input.addEventListener("keyup", handleEnterKeyPress);
        }
      }
    );

    const registerForm = document.getElementById("register-form");
    const requestSuccessTextField = document.getElementById(
      "request-success-text-field"
    );

    if (registerForm && requestSuccessTextField) {
      registerForm.style.width = `${window.innerWidth / 8}px`;
      registerForm.style.height = `${window.innerHeight / 4}px`;
      requestSuccessTextField.style.width = `${window.innerWidth / 6}px`;

      const registerDiv = document.getElementById("register-div");
      if (registerDiv) {
        registerDiv.style.marginTop = `-${registerDiv.offsetHeight / 2}px`;
        registerDiv.style.marginLeft = `-${registerDiv.offsetWidth / 2}px`;
      }
    }

    return () => {
      [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
        (input) => {
          if (input) {
            input.removeEventListener("keyup", handleEnterKeyPress);
          }
        }
      );
    };
  }, []);

  const registrationHandler = async (
    username,
    password,
    email,
    confirmPassword
  ) => {
    setErrorMessageText("");

    if (!username) {
      setErrorMessageText("You must enter a username");
      return;
    }
    if (!email) {
      setErrorMessageText("You must enter an email");
      return;
    }
    if (!password) {
      setErrorMessageText("You must enter a password");
      return;
    }
    if (!confirmPassword) {
      setErrorMessageText("You must enter a confirmation password");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessageText("Passwords do not match");
      return;
    }

    const registerJSON = { username, password, email };

    try {
      const response = await fetch("http://localhost:6001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerJSON),
      });

      const data = await response.json();

      if (response.status === 403) {
        return;
      }
      if (response.status === 409) {
        setErrorMessageText(
          data.errorCode === 410
            ? "Username already taken"
            : "Email already taken"
        );
        return;
      }

      setSuccessMessage(
        `Thank you for signing up! An email has been sent to ${registerJSON.email} with a confirmation link to activate your account.`
      );
      setIsRequestSuccessVisible(true);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <>
      <div
        id="register-div"
        className="register-div"
        hidden={isRequestSuccessVisible}
      >
        <h1 style={{ color: "white" }}>Create account</h1>
        <div style={{ height: "50px" }}>
          {errorMessageText && (
            <b id="error-message" style={{ color: "red" }}>
              {errorMessageText}
            </b>
          )}
        </div>
        <form id="register-form" className="register-form">
          <label htmlFor="username">Username:</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Type your username"
          />
          <hr />

          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Type your email"
          />
          <hr />

          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Type your password"
          />
          <hr />

          <label htmlFor="confirm-password">Confirm password:</label>
          <br />
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm your password"
          />
          <hr />
        </form>
        <button
          className="submit-button"
          id="submit-button"
          onClick={() =>
            registrationHandler(
              document.getElementById("username").value,
              document.getElementById("password").value,
              document.getElementById("email").value,
              document.getElementById("confirm-password").value
            )
          }
        >
          SIGN UP
        </button>
      </div>
      {isRequestSuccessVisible && (
        <div id="request-success-div" className="request-div">
          <p id="request-success-text-field">{successMessage}</p>
        </div>
      )}
    </>
  );
};

export default UserRegisterForm;
