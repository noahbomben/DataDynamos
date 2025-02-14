import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./HomePage.css";

function HomePage() {
    const [projects, setProjects] = useState([])
    const [projectName, setProjectName] = useState("")
    const [projectDescription, setProjectDescription] = useState("")
    const [emailList, setEmailList] = useState("")
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
            setEmailList("")
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

    const handleInvitation = (event) => {
        setEmailList(event.target.value)
        //at some point, this will be used to send email invitations to collaborators
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
                <p>Invite people</p>
                <input type="text" className="project-input" placeholder="Email address" value={emailList} onChange={handleInvitation}/>
            </div>
            <button className="create-button" onClick={handleProject}>Create project</button>
            <Calendar/>
        </>
    );
}

function Calendar (){
    return (
        <div className="calendar">
            <h1> Weekly Calendar</h1>
            <dl>
                <dt>Sunday</dt>
                <dd>To do:</dd>
                <dt>Monday</dt>
                <dd>To do:</dd>
                <dt>Tuesday</dt>
                <dd>To do:</dd>
                <dt>Wednesday</dt>
                <dd>To do:</dd>
                <dt>Thursday</dt>
                <dd>To do:</dd>
                <dt>Friday</dt>
                <dd>To do:</dd>
                <dt>Saturday</dt>
                <dd>To do:</dd>
            </dl>
        </div>
    )
}

export default HomePage;
