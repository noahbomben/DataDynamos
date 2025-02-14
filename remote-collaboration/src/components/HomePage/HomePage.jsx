import React,{useState} from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [projects, setProjects] = useState([])
    const [projectName, setProjectName] = useState("")
    const [projectDescription, setProjectDescription] = useState("")
    const navigate = useNavigate();

    const openProject = () => {
        navigate("/ProjectView")
    }

    const handleProject = () => {
        const newProjects = projects
        const project = {
            name: projectName,
            description: projectDescription
        }
        newProjects.push(project)
        setProjects(newProjects)
        setProjectName("")
        setProjectDescription("")
    }

    const handleProjectName = (event) => {
        setProjectName(event.target.value)
    }

    const handleProjectDescription = (event) => {
        setProjectDescription(event.target.value)
    }

    return (
        <>
             <div className="HomePage">
                <div className="project-list">
                <ul>
                    {
                        projects.map((Project) => (
                            <button onClick={openProject}>{Project.name}
                            <br />--------------------<br />
                            {Project.description}</button>
                        ))
                    }
                </ul>
                </div>
                <div className="create-project">
                    <h1>Create New Project +</h1>
                    <p>Project name</p>
                    <input type="text" placeholder="Project name" value={projectName} onChange={handleProjectName}/>
                    <p>Description</p>
                    <input type="text" placeholder="Description" value={projectDescription} onChange={handleProjectDescription}/>
                </div>
                <div className="calendar">
                    <h1>Calendar</h1>
                </div>
            </div>
            <button className="create" onClick={handleProject}>Create project</button>
        </>
    );
}

export default HomePage;
