import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Background from "../../assets/background-clouds.avif";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import './SignUpPage.css'

const signupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }).nonempty({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema)
  });
  const navigate = useNavigate();

  const switchToLogin = () => {
    navigate("/");
  };

  useEffect(() => {
    const errorKeys = Object.keys(errors);
    errorKeys.forEach((key, index) => {
      setTimeout(() => {
        toast.error(errors[key].message);
      }, (index + 1) * 1000);
    });
  }, [errors]);

  const onSubmit = async (data) => {
    try{
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
      })

      if (response.ok){
        toast.success("Signup Succesfull")
        navigate("/")
      } else {
        toast.error(response.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
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
      <div className="signup-container">
        <h1 id="signup-app-name">CloudCollabSpace</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="email-login">
            <label htmlFor="email"><b>Email</b></label>
            <input className="signup-email" id="signupEmail" type="email" placeholder="name@abc.com" {...register("email")} />
            <label htmlFor="password"><b>Password</b></label>
            <input className="signup-password" id="signupPassword" type="password" placeholder="6+ characters" {...register("password")} />
            <label htmlFor="confirmPassword"><b>Confirm Password</b></label>
            <input className="signup-password" id="confirmPassword" type="password" placeholder="Repeat your password" {...register("confirmPassword")} />
          </div>
          <div className="signup-buttons">
          <button id="signup-signup-button" type="submit">
            Sign Up
          </button>
          <p>Already have an account?</p>
          <button id="signup-login-button" type="button" onClick={switchToLogin}>
            Login
          </button>
        </div>
      </form>
      </div>
    </>
  );
}

export default SignUpPage;