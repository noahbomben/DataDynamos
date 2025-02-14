import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./HomePage.css";

function HomePage() {
    const [projects, setProjects] = useState([])
    const [projectName, setProjectName] = useState("")
    const [projectDescription, setProjectDescription] = useState("")
    const navigate = useNavigate();

    const openProject = () => {
        navigate("/ProjectView")
    }

    const handleProject = () => {
        if (projectName !== "" && projectDescription !== "") {
            const newProjects = projects
            const project = {
                name: projectName,
                description: projectDescription
            }
            newProjects.push(project)
            setProjects(newProjects)
            setProjectName("")
            setProjectDescription("")
        } else {
            toast.error("Please enter project name and description");
        }
    }

    const handleProjectName = (event) => {
        setProjectName(event.target.value)
    }

    const handleProjectDescription = (event) => {
        setProjectDescription(event.target.value)
    }

    return (
        <>
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
                <input type="text" className="project-input" placeholder="Project name" value={projectName} onChange={handleProjectName}/>
                <p>Description</p>
                <input type="text" className="project-input" placeholder="Description" value={projectDescription} onChange={handleProjectDescription}/>
            </div>
            <button className="create-button" onClick={handleProject}>Create project</button>
            <div className="calendar">
                <h1>Calendar</h1>
            </div>
            <button className="create" onClick={handleProject}>Create project</button>
        </>
    );
}

export default HomePage;
