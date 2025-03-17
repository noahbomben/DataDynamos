const mongoose = require("mongoose");
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = "mongodb+srv://DataDynamos:Password123@cloudcollabspace.xqhui.mongodb.net/?retryWrites=true&w=majority&appName=CloudCollabSpace"
const JWT_SECRET="mysecretkeysisverysecret"

const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",  // Allow all origins (update for security)
    methods: ["GET", "POST"]
  }
});

mongoose.connect(DATABASE_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Failed to connect to MongoDB", error));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const projectSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  users: [],
});


const messageSchema = new mongoose.Schema({
  email: { type: String, required: true },
  projectID: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
});

const listSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: String, required: true },
  list: [],
});

const Project = mongoose.model("Project", projectSchema,"projects")
const User = mongoose.model("User", userSchema)
const Message = mongoose.model("Message", messageSchema)
const List = mongoose.model("List", listSchema)

app.use(cors());
app.use(bodyParser.json());

app.post("/api/signup", async (req, res) => {
    const { email, password, ...rest } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter an email and password" })
    }
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "A user with the specified email already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ ...rest, email, password: hashedPassword });
        await newUser.save()
        res.status(201).json({ message: "user created successfully", user: { ...newUser._doc, password: undefined } });
    } catch (err) {
        return res.status(500).json({ message: err.message || "error while signup" });
    }
});

// login endpoint - authenticates user and generates a jwt token
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "please fill all required fields" });
    }
    
    try {
      const user = await User.findOne({email})
      if (!user) {
        return res.status(401).json({ message: "user does not exist" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({message : "Invalid Credentials"}, password, user.password)   
      }
      const token = jwt.sign({ id: user.email }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: "login successful", token, user });
    } catch (err) {
      return res.status(500).json({ message: "error finding user", error: err.message });
    }
  });

app.post("/api/createProject", async (req, res) => {
  const {email, name, description, users} = req.body;

  if(!name || !description){
    return res.status(400).json({ message: "Please enter all fields"});
  }
  //Make sure added users are added twice and that it's not the creator
  const uniqueUsers = [];
  uniqueUsers.push(email);
  users.forEach( v => {
    if( !(uniqueUsers.indexOf(v) != -1)){
      uniqueUsers.push(v);
    } 
  });

  try{
    //Create project
    const project = await Project.findOne({ email, name });
    if(project){
      return res.status(401).json({ message: "Project created by this user already exists" })
    }
    const newProject = new Project({email, name, description, users: uniqueUsers});
    await newProject.save();
    res.status(201).json({ message: "Project created successfully", newProject});

  } catch (error){
    return res.status(500).json({ message: "Error creating project", error: error.message });
  }

});

app.post("/api/getList", async (req, res) => {
  const {date, email} = req.body;
  try {
    const toDoList = await List.findOne({ date, email });
    res.status(200).json({ message: "List retreived sucessfully", toDoList});
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving list", error: err.message });
  }
});

app.post("/api/setList", async (req, res) => {
  const {date, email, list} = req.body;
  try {
    //check if list exists
    const toDoList = await List.findOne({ date, email });
    if (toDoList){
        //Update existing list
        const ret = await List.updateOne({ date, email }, { list: list });
        if (ret.modifiedCount != 0){
          res.status(200).json({ message: "List updated sucessfully"});
        } else{
          res.status(500).json({ message: "List couldn't be updated"});
        }
    } else {
        //create new list
        const newList = new List({ date, email, list });
        await newList.save();
        res.status(201).json({ message: "To-Do List created successfully"});
    }
  }
  catch (err){
    res.status(500).json({ message: "Error saving changes to the to-do list", error: err.message});
  }
});

app.post("/api/getProjects", async (req, res) => {
  const {email} = req.body;
  try{
    const createdProjects = await Project.find({email});
    const otherProjects = await Project.find({ users: email });

    const projects = createdProjects.concat(otherProjects)
    res.status(200).json({ message: "Projects retreived sucessfully", projects});

  } catch (error){
    return res.status(500).json({ message: "Error retrieving projects", error: error.message });
  }

});

app.post("/api/deleteProject", async (req, res) => {
  const {_id} = req.body;

  //Issues will occur if someone else is on the page at the time of deletion
  try{
    const ret = await Project.deleteOne({_id});
    if (ret.deletedCount == 0){
      res.status(500).json({ message: "Project doesn't exist"});
    }
    const ret2 = await Message.deleteMany({projectID: _id});
    if(ret2.deletedCount == 0){
      res.status(200).json({ message: "Project delete, No messages deleted"});
    } else{
      res.status(200).json({ message: "Messages and Project deleted"});
    }
    
  } catch (error) {
    return res.status(500).json({ message: "Error deleting project", error: error.message });
  }
});

app.post("/api/leaveProject", async (req, res) => {
  const {_id, email} = req.body;

  //Issues will occur if someone else is on the page at the time of deletion
  try{
    //delete user from users array
    const ret = await Project.updateOne({_id}, {$pull: {users: email}});
    if (ret.modifiedCount == 0){
      res.status(500).json({ message: "User couldn't be removed"});
    }
    //Delete their messages?
    const ret2 = await Message.deleteMany({email, projectID: _id});
    if (ret2.deletedCount == 0){
      res.status(200).json({ message: "User removed. No messages deleted"});
    } else{
      res.status(200).json({ message: "User removed. Messages deleted"});
    }

  } catch (error) {
    return res.status(500).json({ message: "Error removing user", error: error.message });
  }
});

app.post("/api/addUserToProject", async (req, res) => {
  const {email,_id } = req.body;

  try{
    //check if user in
    const project = await Project.findOne({_id});
    const index = project.users.indexOf(email);
    if(index != -1){
      res.status(500).json({ message: "User already in project"});
    }
    //add user to project
    const ret = await Project.updateOne({_id}, {$push: {users: email}});
    if (ret.modifiedCount != 0){
      res.status(200).json({ message: "User added sucessfully"});
    } else{
      res.status(500).json({ message: "User couldn't be added"});
    }
    
  } catch (error) {
    return res.status(500).json({ message: "Error editing project", error: error.message });
  }
});

app.post("/api/messages", async (req, res) => {
  const { email, projectID, message, time } = req.body;

  if (!email || !projectID || !message || !time) {
    return res.status(400).json({ message: "please provide all fields" });
  }

  try {
    const user = await User.findOne({email})

    if (!user) {  // validating before adding to db
      return res.status(401).json({ message: "user does not exist" });
    }

    const newMessage = new Message({email, projectID, message, time});
    await newMessage.save()
    res.status(200).json({ message: "message added successfully"});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error sending message", error: err.message });
  }  

});

app.get("/api/messages", async (req, res) => {

  const { projectID } = req.query;  // errors will be caught in catch

  try {
    const orderedArray = [];
    const data = await Message.find({projectID})   // no eror check needed, could be no messages exist
    const sortedData = data.sort((a, b) => parseInt(a.time) - parseInt(b.time)) // Sort by time to preserve message order
      .map(({ email, message }) => ({ email, message }));
    sortedData.map((item) => {
      orderedArray.push([item.email, item.message]);
    });
    res.status(200).json({ data: orderedArray});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error getting messages", error: err.message });
  }  

});

io.sockets.on('connection', function (socket) {
    // set up individual room connection for users to recieve messages
  socket.on('join', function (data) {
    socket.join(data.email);
  })
})

// Message.watch() detects for database changes
Message.watch().on('change', async data => {
  //Bandaid fix for issue when deleting messages
  if(!data.fullDocument){
    return;
  }
  try { // if anything fails here, nothing we can do just let user refresh page and messages will show from db
    const _id = data.fullDocument.projectID;  // if its a message change grab the id
    const project = await Project.findOne({ _id }); // find corresponding project
    const users = project.users;  // get the users from the project
    // tell all participants that they've recieved messages
    users.map((item) => { 
      io.sockets.in(item).emit('new_msg', {msg: 'new messages'});
    })
  } catch (error){
    // no need to respond to anyone
    console.log(error);
  }
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
