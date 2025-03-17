import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import "./HomePage.css";
import CalendarList from "../Calendar/CalendarList";

const SERVICE_ID = "service_phfpt64"
const TEMPLATE_ID = "template_v3tskjp"
const PUBLIC_KEY = 'PHYOYRckEi2J7d1MG'

function HomePage() {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [emailList, setEmailList] = useState([]);

    //Loads projects from database
    const loadProjects = async () =>{
        const e = {
            email: localStorage.getItem("email")
        };
        const newProjects = await fetch("http://localhost:3000/api/getProjects", {
            method: "POST",
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify(e)
        });
        const newProjectsData = await newProjects.json();
        if (!newProjects.ok) {
            toast.error(newProjectsData.message || "Couldn't fetch projects");
            return
        }
        setProjects(newProjectsData.projects)
    }
    //Used to load projects on everyload.
    useEffect(() => {
        loadProjects();
    }, [])
    //Works same as useffect, but slower?
    //loadProjects();
    
    const navigate = useNavigate();

    const openProject = (Project) => {
        navigate("/ProjectView", { state: Project})
    }

    const handleProject = async () => {
        console.log("Creating Project");
        
        if (projectName == "" || projectDescription == "") {
            toast.error("Please enter project name and description");
            return
        }
        if (projectName.length > 20) {
            toast.error("Project name cannot exceed 20 characters");
            return
        }
        if (projectDescription.length > 145) {
            toast.error("Project description cannot exceed 145 characters");
            return
        }
        try{
            const project = {
                email: localStorage.getItem("email"),
                name: projectName,
                description: projectDescription,
                users: emailList
            }
            const response = await fetch("http://localhost:3000/api/createProject", {
                method: "POST",
                headers: {
                  "Content-Type" : "application/json"
                },
                body: JSON.stringify(project)
            });
            const responseData = await response.json();
            if (!response.ok) {
                toast.error(responseData.message || "Creating project failed. Please try again");
                return
            }
            for (let i = 0; i < emailList.length; i++){
                handleInvitation(i)
            }
            setProjectName("");
            setProjectDescription("");
            setEmailList([]);
            loadProjects();     
        } catch (error){
            console.error("Project Creation error:", error);
            toast.error("An error occurred during project creation. Please try again.")
        }
    }
        

    const handleProjectName = (event) => {
        setProjectName(event.target.value)
    }

    const handleProjectDescription = (event) => {
        setProjectDescription(event.target.value)
    }

    const handleInputs = () => {
        setEmailList([...emailList, ''])
    }

    const handleInviteChange = (event, index) => {
        const updatedEmailList = [...emailList];
        updatedEmailList[index] = event.target.value;
        setEmailList(updatedEmailList)
    }

    const handleInvitation = (index) => {
        const templateParams = {
            to: emailList[index],
            from_name: "CloudCollabSpace",
            message: "You've been invited to work on the project " + projectName + " https://bucolic-salmiakki-8dc5f3.netlify.app/"
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then((response) => {
            console.log("Email sent successfully!", response);
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
                <div className="homepage-navbar"> 
                    <div className="navbar-name"> CloudCollabSpace </div>
                </div>
                <button className="logout_button" onClick={logout}>Logout</button>
                <div className="project-list" id="Project List">
                    <ul>
                        {
                            projects.map((Project, index) => (
                                <div key={index}>
                                    <button onClick={() => openProject(Project)}> 
                                        <h2>{Project.name}</h2>
                                        <p>{Project.description}</p>
                                    </button>
                                </div>
                                
                            ))
                        }
                    </ul>
                </div>
                <div className="create-project" id="Create Project">
                    <h1>Create New Project +</h1>
                    <p>Project Name</p>
                    <input type="text" className="project-input" placeholder="Project Name" value={projectName} onChange={handleProjectName}/>
                    <p>Description</p>
                    <input type="text" className="project-input" placeholder="Description" value={projectDescription} onChange={handleProjectDescription}/>
                    <p>Invite People <button className="invite-button" onClick={handleInputs}>+</button></p>
                    {emailList.map((inputValue, index) => (
                        <input key={index} type="text" className="project-input" placeholder="Email Address" value={inputValue} onChange={(event) => handleInviteChange(event, index)}/>
                    ))}
                    <button className="create-button" onClick={handleProject}>Create project</button>
                </div>
                <CalendarList></CalendarList>
            </div>
        </>
    );
}


export default HomePage;
