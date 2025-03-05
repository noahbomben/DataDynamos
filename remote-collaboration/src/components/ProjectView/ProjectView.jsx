import React from "react";
import { useState } from "react";
import './ProjectView.css'
import { useNavigate, useLocation } from "react-router-dom";
import WhiteBoard from "../WhiteBoard/WhiteBoard";

function ProjectView() {
    const navigate = useNavigate()
    const location = useLocation();
    const project = location.state;

    const closeProject = () => {
        navigate("/HomePage")
    }
    return(

        <>
            <div className="projectview_page">
                <button className="close_project_button" onClick={closeProject}>Home</button>
                <div className="projectview-container">
                    <div className="whiteboard-container">
                        <h2>Whiteboard</h2>
                        <div className="whiteboard"></div>
                    </div>
                    <div className="projectinfo">
                        <div className="info">
                            <h1>{project.name}</h1>
                            <p>{project.description}</p>
                        </div>
                        <div className="members">
                            <h2>Members</h2>
                            <button> + </button>
                        </div>
                    </div>
                    <div className="projectcontent">
                        <div className="files"></div>
                        <ChatBox></ChatBox>
                    </div>
                </div>
            </div>
        </>
    )
}

// MOVE later
var x = [['green', 'hello'], ['blue', 'hey, when are we meeting?'], ['yellow', 'I thought today... No?'],
['blue', 'I think we should meet sometime next week lets take a look at the schedule']];


function ChatBox() {

    const [fakeData, setFakeData] = useState(x);

    return (
        <div className="chat">
            {
                fakeData.map((item) => {
                    let profile = item[0];
                    let msg = item[1];
                    return(
                        <Message profileIcon={profile} msg={msg}></Message>
                    )
                })
            }
            <SendText setFakeData={setFakeData} fakeData={fakeData}></SendText>
        </div>
    )
}

function SendText({setFakeData, fakeData}) {

    const [text, setText] = useState("");

    const updateText = (e) => {
        setText(e.target.value);
    }

    const sendText = () => {
        if (text.length > 0) {
            setFakeData([... fakeData, ['black', text]]); 
            setText("");  
        }  
    }

    return (  /* img cut off fix later*/
        <div className="text-container">
            <input className="text" placeholder="Write message" onChange={updateText} value={text}></input>
            <button className="send-text" onClick={sendText}></button>
        </div>
    )
}

function Message({profileIcon, msg}) {
    return (
        <div className="msg-container">
            <div className="profile-icon" style={{backgroundColor: profileIcon}}></div>
            <div className="msg"><p style={{overflowWrap: "break-word"}}>{msg}</p></div>
        </div>
    )
}


export default ProjectView