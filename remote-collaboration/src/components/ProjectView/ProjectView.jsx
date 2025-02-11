import React from "react";
import './ProjectView.css'
import { useNavigate } from "react-router-dom";
function ProjectView() {
    const navigate = useNavigate()

    const closeProject = () => {
        navigate("/HomePage")
    }
    return(

        <>
        <div className="page">
            <button className="close_project_button" onClick={closeProject}>X</button>
            <div className="projectview-container">
                <div className="whiteboard-container">
                    <h2>Whiteboard</h2>
                    <div className="whiteboard"></div>
                </div>
                <div className="projectinfo">
                    <div className="info">
                        <h1>Project Name</h1>
                        <p>Description of the project</p>
                    </div>
                    <div className="members">
                        <h2>Members</h2>
                        <button> + </button>
                    </div>
                </div>
                <div className="projectcontent">
                    <div className="files"></div>
                    <div className="chat"></div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProjectView