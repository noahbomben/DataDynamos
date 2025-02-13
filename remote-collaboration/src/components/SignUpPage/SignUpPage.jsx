import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Background from "../../assets/background-clouds.avif";
import './SignUpPage.css'

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const navigate = useNavigate();

  const showToast = () => {
    console.log("toast")
    toast.success("Already have an account?", {
      onClick: switchToLogin,
      position: "bottom-right",
      autoClose: false,
      closeOnClick: true,
      closeButton: false,
    });
  };

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  const changePasswordConf = (event) => {
    setPasswordConf(event.target.value);
  };

  const switchToLogin = () => {
    navigate("/");
  };

  const handleSignUp = () => {
    console.log(email);
    console.log(password);
    if (password !== passwordConf) {
      toast.error("Passwords do not match");
    } else if (email != "" && password != "") {
      navigate("/HomePage");
    }
  };

  useEffect(() => {
    showToast();
  }, []);

  useEffect(() => {
    // Apply background image only for the login page
    document.body.style.backgroundImage = `
    linear-gradient( 180deg,
    rgba(255, 255, 255, 0),    
    rgba(255, 255, 255, .1)),
    url(${Background})
  `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";

    return () => {
      // Remove background when leaving the login page
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <>
      <div className="signup-container">
        <h1 id="signup-app-name">[App Name]</h1>
        <div className="signup-input-boxes">
          <input
            type="email"
            className="signup-email"
            placeholder="Email"
            value={email}
            onChange={changeEmail}
          />
          <input
            type="password"
            className="signup-password"
            placeholder="Password"
            value={password}
            onChange={changePassword}
          />
          <input
            type="password"
            className="signup-password"
            placeholder="Confirm Password"
            value={passwordConf}
            onChange={changePasswordConf}
          />
        </div>
        <div className="signup-buttons">
          <button id="signup-signup-button" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
