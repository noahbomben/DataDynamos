import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const openProject = () => {
        navigate("/ProjectView")
    }

    return (
        <div className="HomePage">
            <div className="project-list">
                <button onClick={openProject}>Project 1</button>
                <button onClick={openProject}>Project 2</button>
                <button onClick={openProject}>Project 3</button>
                <button onClick={openProject}>Project 4</button>
            </div>
            <div className="create-project">
                <h1>Create New Project +</h1>
                <p>Project name</p>
                <input type="text" placeholder="Project name" />
                <p>Description</p>
                <input type="text" placeholder="Description" />
            </div>
            <div className="calendar">
                <h1>Calendar</h1>
            </div>
            <button className="create">Create project</button>
        </div>
    );
}

export default HomePage;
