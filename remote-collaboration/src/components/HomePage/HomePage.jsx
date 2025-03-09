import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import "./HomePage.css";


const SERVICE_ID = "service_phfpt64"
const TEMPLATE_ID = "template_v3tskjp"
const PUBLIC_KEY = 'PHYOYRckEi2J7d1MG'

function HomePage() {
    const [projects, setProjects] = useState(localStorage.getItem("Projects") ? JSON.parse(localStorage.getItem("Projects")) : [])
    const [projectName, setProjectName] = useState("")
    const [projectDescription, setProjectDescription] = useState("")
    const [emailList, setEmailList] = useState("")
    const navigate = useNavigate();

    const openProject = (Project) => {
        navigate("/ProjectView", { state: Project})
    }

    const handleProject = () => {
        if (projectName !== "" && projectDescription !== "") {
            const newProjects = projects
            const project = {
                name: projectName,
                description: projectDescription
            }
            newProjects.push(project)
            localStorage.setItem("Projects", JSON.stringify(newProjects));
            setProjects(newProjects)
            handleInvitation(event)
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
        event.preventDefault();
        console.log(emailList)
        const templateParams = {
            to: emailList,
            from_name: "TEST_NAME",
            message: "THIS IS A TEST EMAIL INVITE http://localhost:5173/"
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then((response) => {
            console.log("Email sent successfully!", response);
            setEmailList('');
        })
        .catch((error) => {
            console.error("Error sending email:", error);
        });
    }

    const logout = () => {
        navigate("/")
    }

    return (
        <>
            <div className="project-page">
                <button className="logout_button" onClick={logout}>Logout</button>
                <div className="project-list">
                    <ul>
                        {
                            projects.map((Project) => (
                                <button onClick={() => openProject(Project)}> <h2>{Project.name}</h2>
                                {/* <br />--------------------<br /> */}
                                <p>{Project.description}</p></button>
                            ))
                        }
                    </ul>
                </div>
                <div className="create-project">
                    <h1>Create New Project +</h1>
                    <p>Project Name</p>
                    <input type="text" className="project-input" placeholder="Project Name" value={projectName} onChange={handleProjectName}/>
                    <p>Description</p>
                    <input type="text" className="project-input" placeholder="Description" value={projectDescription} onChange={handleProjectDescription}/>
                    <p>Invite People</p>
                    <input type="text" className="project-input" placeholder="Email Address" value={emailList} onChange={(event) => setEmailList(event.target.value)}/>
                    <button className="create-button" onClick={handleProject}>Create project</button>
                </div>
                <Calendar></Calendar>
            </div>
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
