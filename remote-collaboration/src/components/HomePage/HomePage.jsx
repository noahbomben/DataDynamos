import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import "./HomePage.css";


const SERVICE_ID = "service_phfpt64"
const TEMPLATE_ID = "template_v3tskjp"
const PUBLIC_KEY = 'PHYOYRckEi2J7d1MG'

function HomePage() {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [emailList, setEmailList] = useState([]);
    const [emailInputs, setEmailInputs] = useState([]);

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
            //This causes an error, so I commented it out for now.
            //handleInvitation(event)
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
        setEmailInputs([...emailInputs, ''])
    }

    const handleInvitation = (event) => {
        event.preventDefault();
        console.log(emailList)
        const templateParams = {
            to: emailList,
            from_name: "CloudColabSpace",
            message: "You've been invited to work on the project " + projectName + " http://localhost:5173/"
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
                    <p>Invite People <button onClick={handleInputs}>+</button></p>
                    {/* {emailInputs.map((inputValue, index) => (
                        <input key="index" type="text" className="project-input" placeholder="Email Address" value={inputValue}/>
                    ))} */}
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
