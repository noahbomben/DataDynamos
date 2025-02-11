import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const navigate = useNavigate();

  const showToast = () => {
    toast.success("Already have an account?", {
      onClick: switchToLogin,
      position: "bottom-right",
      autoClose: false,
      closeOnClick: true,
      closeButton: false
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
    showToast()
  }, [])

  return (
    <>
      <div className="login-container">
        <h1 id="app-name">[App Name]</h1>
        <div className="input-boxes">
          <input
            type="email"
            className="login-email"
            placeholder="Email"
            value={email}
            onChange={changeEmail}
          />
          <input
            type="password"
            className="login-password"
            placeholder="Password"
            value={password}
            onChange={changePassword}
          />
          <input
            type="password"
            className="login-password"
            placeholder="Confirm Password"
            value={passwordConf}
            onChange={changePasswordConf}
          />
        </div>
        <div className="buttons">
          <button id="signup-button" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
