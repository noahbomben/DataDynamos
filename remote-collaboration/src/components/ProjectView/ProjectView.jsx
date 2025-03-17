import React, { useEffect, useState, useRef } from "react";
import "./ProjectView.css";
import { useNavigate, useLocation } from "react-router-dom";
import WhiteBoard from "../WhiteBoard/WhiteBoard";
import FileUpload from "../FileUpload/FileUpload";
import ChatBox from "../ChatBox/ChatBox";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import { Button, Icon } from "semantic-ui-react";

const SERVICE_ID = "service_phfpt64";
const TEMPLATE_ID = "template_v3tskjp";
const PUBLIC_KEY = "PHYOYRckEi2J7d1MG";

function ProjectView() {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state;
  const curUser = localStorage.getItem("email");
  const allUsers = [...project.users];
  const [newUser, setNewUser] = useState("");

  const closeProject = () => {
    navigate("/HomePage");
  };
  const deleteProject = async () => {
    try {
      const del = await fetch("http://localhost:3000/api/deleteProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!del.ok) {
        // toast.error(deleteData.message || "An error occured during project deletion. Please try again.");
        return;
      }
      navigate("/HomePage");
    } catch (error) {
      console.error("Project deletion error:", error);
      // toast.error("An error occured during project deletion. Please try again.")
    }
  };

  const leaveProject = async () => {
    try {
      const input = {
        _id: project._id,
        email: curUser,
      };

      const del = await fetch("http://localhost:3000/api/leaveProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!del.ok) {
        // toast.error(deleteData.message || "An error occured during project deletion. Please try again.");
        return;
      }
      navigate("/HomePage");
    } catch (error) {
      console.error("Project leavetion error:", error);
      // toast.error("An error occured during project deletion. Please try again.")
    }
  };

  const addUSer = () => {};

  const handleInviteChange = (event) => {
    setNewUser(event.target.value);
  };

  const handleInvitation = async () => {
    try {
      const input = {
        _id: project._id,
        email: newUser,
      };

      const add = await fetch("http://localhost:3000/api/addUserToProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!add.ok) {
        return;
      }
    } catch (error) {
      console.error("User added error:", error);
    }

    const templateParams = {
      to: newUser,
      from_name: "CloudCollabSpace",
      message:
        "You've been invited to work on the project " +
        project.name +
        " https://bucolic-salmiakki-8dc5f3.netlify.app/",
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log("Email sent successfully!", response);
        toast.success("Invitation sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        toast.error("Error sending invitation");
      });
    setNewUser("");
  };

  return (
    <>
      <div className="projectview_page">

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "10px",
          }}
        >
          <Button color="blue" onClick={closeProject} icon labelPosition="left">
            <Icon name="home" />
            Home
          </Button>

          {curUser === project.email ? (
            <Button
              color="red"
              onClick={deleteProject}
              icon
              labelPosition="left"
            >
              <Icon name="trash alternate" />
              Delete
            </Button>
          ) : (
            <Button
              color="orange"
              onClick={leaveProject}
              icon
              labelPosition="left"
            >
              <Icon name="sign-out" />
              Leave
            </Button>
          )}
        </div>

        <div className="projectview-container">
          <div className="whiteboard-container">
            <h2>Whiteboard</h2>
            <WhiteBoard></WhiteBoard>
          </div>
          <div className="projectinfo">
            <div className="info">
              <h1>{project.name}</h1>
              <p>{project.description}</p>
            </div>
            <div className="members-wrapper">
              <div className="members">
                <h2>
                  Members{" "}
                  <input
                    type="text"
                    className="project-input"
                    placeholder="Email Address"
                    onChange={(event) => handleInviteChange(event)}
                  />
                </h2>
                <button onClick={handleInvitation}> + </button>
                <div className="profile-icons-wrapper">
                  {allUsers.map((item, index) => {
                    const firstLetter = item[0].toUpperCase();
                    return (
                      <div className="profile-icon" key={index}>
                        {firstLetter}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* <b>{project.users}</b> */}
          </div>
          <div className="projectcontent">
            <div className="files">
              <FileUpload></FileUpload>
            </div>
            <ChatBox></ChatBox>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectView;
