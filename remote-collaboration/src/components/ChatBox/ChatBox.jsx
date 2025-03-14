import React, { useEffect, useState, useRef } from "react";
import './ChatBox.css'
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function ChatBox() {

    const [userData, setUserData] = useState([]);
    const divRef = useRef(null);
    const email = localStorage.getItem('email');
    const location = useLocation();
    const project = location.state;
    const projectID = project._id;

    useEffect(() => {
        getMessages();
        setTimeout(() => {
            scrollToBottom();
        }, 500);
        // create unique chat room for live chats
        socket.emit('join', {email: email}) // chat room id for receiving messages
            // call back funcion for receiving messages
        socket.on("new_msg", function(data) {
            getMessages();
            setTimeout(() => { // wait for messages to load before scrolling down to latest messages
                scrollToBottom();
            }, 500);
        })
    }, [])

    const getMessages = async () => {
        try {
            const queryString = new URLSearchParams({projectID}).toString();
            const response = await fetch(`http://localhost:3000/api/messages?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            },
            })
    
            const responseData = await response.json()
            if (response.ok) {
                setUserData(responseData.data)
            } else {
                console.log(responseData);
                toast.error("An error occurred getting messages");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred getting messages");
        }
    }

    const scrollToBottom = () => {
        if (divRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        } 
    }

    return (
        <div className="chat" id="chat-box">
            <div className="chat-scroll"  ref={divRef}>
                {
                    userData.map((item, index) => {
                        let email = item[0];
                        let msg = item[1];
                        return(
                            <Message email={email} msg={msg} key={index}></Message>
                        )
                    })
                }
            </div>
            <SendText setUserData={setUserData} userData={userData} email={email} projectID={projectID} scrollToBottom={scrollToBottom}></SendText>  
        </div>
    )
}

function SendText({setUserData, userData, email, projectID, scrollToBottom}) {

    const [message, setMessage] = useState("");
    const date = new Date();

    const updateText = (e) => {
        setMessage(e.target.value);
    }

    const sendText = async () => {

        const time = date.getTime();  // time stamp to store in db
        const data = {email, projectID, message, time}

        try {
            const response = await fetch("http://localhost:3000/api/messages", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
            })
    
            const responseData = await response.json()
            if (response.ok) {
                setUserData([... userData, [email, message]]); 
                setMessage("");  
                setTimeout(() => {
                    scrollToBottom();
                }, 500);
            } else {
                console.log(responseData);
                toast.error("An error occurred sending message, please try again");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred sending message, please try again");
        }
    }

    return (
        <div className="text-container" id="text-input">
            <input className="text" placeholder="Write message" onChange={updateText} value={message}></input>
            <button className="send-text" onClick={sendText}></button>
        </div>
    )
}

function Message({email, msg}) {
    const userEmail = localStorage.getItem('email');
    const [emailDisplayed, setEmailDisplayed] = useState(false);

    const displayEmail = () => {
        setEmailDisplayed(true);
    }

    const removeDisplayedEmail = () => {
        setEmailDisplayed(false);
    }

    return (
        <>
            {userEmail !== email ? (
                <div className="msg-container" id="user-msg">
                    <div className="profile-icon" onMouseEnter={displayEmail} onMouseLeave={removeDisplayedEmail}>{email[0].toUpperCase()}</div>
                    {emailDisplayed ? <div className="msg" style={{backgroundColor: '#469de5'}}><p style={{color: 'white'}}>{email}</p></div> : <div className="msg"><p>{msg}</p></div>}
                </div>
            ) : ( 
                <div className="msg-container" style={{justifyContent: "end"}}>
                    <div className="msg" style={{backgroundColor: '#e1e4e8'}}><p>{msg}</p></div>
                    <div className="profile-icon" style={{marginLeft: "2%", marginRight: "1%"}}>{email[0].toUpperCase()}</div>
                </div>
            )}
        </>
    )
}

export default ChatBox