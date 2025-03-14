import React, { useEffect, useState, useRef } from "react";
import './ProjectView.css'
import { useNavigate, useLocation } from "react-router-dom";
import WhiteBoard from "../WhiteBoard/WhiteBoard";
import FileUpload from "../FileUpload/FileUpload";
import ChatBox from "../ChatBox/ChatBox";
import { Toaster } from "react-hot-toast";


function ProjectView() { 
    const navigate = useNavigate()
    const location = useLocation();
    const project = location.state;
    const curUser = localStorage.getItem('email');
    const allUsers = [curUser, ... project.users];

    const closeProject = () => {
        navigate("/HomePage")
    }
    return(
        <>
            <Toaster></Toaster>
            <div className="projectview_page">
                {/* <div className="projectpage-navbar"> 
                    <div className="nav-name"> CloudCollabSpace </div>
                </div> */}
                <button className="close_project_button" onClick={closeProject}>Home</button>
                <div className="projectview-container">
                    <div className="whiteboard-container">
                        <h2>Whiteboard</h2>
                        <WhiteBoard></WhiteBoard>
                    </div>
                    <div className="projectinfo">
                        <div className="info">
                            <h1>{project.name}</h1>
                            <p>{project.description}</p>
                        </div>
                        <div className="members-wrapper">
                            <div className="members">
                                <h2>Members</h2>
                                <button> + </button>
                                {/* Have this field be able to add people*/}
                            </div>
                            <div className="profile-icons-wrapper">
                                {
                                    allUsers.map((item, index) => {
                                        const firstLetter = item[0].toUpperCase();
                                        return(
                                            <div className="profile-icon" key={index}>{firstLetter}</div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {/* <b>{project.users}</b> */}
                    </div>
                    <div className="projectcontent">
                        <div className="files">
                            <FileUpload></FileUpload>
                        </div>
                        <ChatBox></ChatBox>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectView
