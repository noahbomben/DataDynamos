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

mongoose.connect(DATABASE_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Failed to connect to MongoDB", error));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true},
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

const Project = mongoose.model("Project", projectSchema,"projects")
const User = mongoose.model("User", userSchema)
const Message = mongoose.model("Message", messageSchema)

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

  try{
    const user = await User.findOne({email});
    const userId = user._id;
    
    const project = await Project.findOne({ userId, name });
    if(project){
      return res.status(401).json({ message: "Project created by this user already exists" })
    }
    //Assumes all users are signed up currently
    const usersList = [];
    for (let i = 0; i < users.length; i++){
      const currentEmail = users[i];
      const user = await User.findOne({email: currentEmail});
      usersList.push(user._id);
    }

    const newProject = new Project({userId, name, description, users: usersList});
    await newProject.save();
    res.status(201).json({ message: "project created successfully", newProject});

  } catch (error){
    return res.status(500).json({ message: "error creating project", error: error.message });
  }

})

app.post("/api/getProjects", async (req, res) => {
  const {email} = req.body;
  //Doesn't return projects you don't create
  try{
    const user = await User.findOne({email});
    const userId = user._id;
    
    const projects = await Project.find({ userId});
    res.status(200).json({ message: "projects retrived sucessfully", projects});

  } catch (error){
    return res.status(500).json({ message: "error retrieving projects", error: error.message });
  }

})
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

// TODO: Add listener to be alerted to new messages?
app.get("/api/messages", async (req, res) => {

  const { projectID } = req.query;
    // add sanity check for if project exists
  try {
    const orderedArray = [];
    const data = await Message.find({projectID})
    const sortedData = data.sort((a, b) => parseInt(a.time) - parseInt(b.time)) // Sort by `time`
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

app.listen(PORT, () => console.log(`server running on port ${PORT}`));