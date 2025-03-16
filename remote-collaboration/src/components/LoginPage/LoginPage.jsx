import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
        localStorage.setItem("email", data.email)
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
        <h1 id="login-app-name">CloudCollabSpace</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="email-login">
            <label htmlFor="email"><b>Email</b></label>
            <input className="login-email" id="email" type="email" placeholder="name@abc.com" {...register("email")} />
            <label htmlFor="password"><b>Password</b></label>
            <input className="login-password" id="password" type="password" placeholder="6+ characters" {...register("password")} />
          </div>
          <div className="login-buttons">
          <button id="login-login-button" type="submit">
            Login
          </button>
          <p>Don't have an account?</p>
          <button id="login-signup-button" type="button" onClick={switchToSignUp}>
            Sign Up
          </button>
        </div>
      </form>
      </div>
    </>
  );
};

export default LoginPage;
