import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Background from "../../assets/background-clouds.avif";

import "./LoginPage.css";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  // const changeEmail = (event) => {
  //     setEmail(event.target.value);
  // }

  // const changePassword = (event) =>{
  //     setPassword(event.target.value)
  // }

  // const handleLogin = () => {
  //     console.log(email)
  //     console.log(password)
  //     if (email != "" && password != "") {
  //         navigate('/HomePage');
  //     }
  //     else(
  //         toast.error("Invalid username or password")
  //     )
  // }

  useEffect(() => {
    const errorKeys = Object.keys(errors);
    errorKeys.forEach((key, index) => {
      setTimeout(() => {
        toast.error(errors[key].message);
      }, (index + 1) * 1000);
    });
  }, [errors]);

  const switchToSignUp = () => {
    navigate("/SignUpPage");
  };

  const onSubmit = async (data) => {
    console.log("Login")
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()
      if (response.ok) {
        toast.success("Login Successfull")
        navigate("/HomePage")
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during signup. Please try again.");
    }
  };


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
      <div className="login-container">
        <h1 id="login-app-name">CloudSpace</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="title">Sign up</h2>
          </div>
          <div className="email-login">
            <label htmlFor="email"><b>Email</b></label>
            <input className="login-email" type="email" placeholder="name@abc.com" {...register("email")} />
            <label htmlFor="password"><b>Password</b></label>
            <input className="login-password" type="password" placeholder="8+ characters" {...register("password")} />
          </div>
          <div className="login-buttons">
          <button id="login-login-button" type="submit">
            Login
          </button>
          <button id="login-signup-button" onClick={switchToSignUp}>
            Sign Up
          </button>
        </div>
      </form>
      </div>
    </>
  );
};

export default LoginPage;
