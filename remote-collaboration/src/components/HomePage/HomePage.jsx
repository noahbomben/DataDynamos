import React from "react";
import './HomePage.css'

function HomePage() {
    return (
        <>
        <div className="project-list">
            <ul>Project 1</ul>
            <ul>Project 2</ul>
            <ul>Project 3</ul>
            <ul>Project 4</ul>
        </div>
        <div className="create-project">
            <h1>Create New Project +</h1>
            <p>Project name</p>
            <input type="text" placeholder="Project name"/>
            <p>Description</p>
            <input type="text" placeholder="Description"/>
        </div>
            <button className="create" >Create project</button>
        <div className="calendar">
            <h1>Calendar</h1>
        </div>
        </>
    )

}

export default HomePage