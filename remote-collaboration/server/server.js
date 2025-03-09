const mongoose = require("mongoose");
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();  // test comment
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

const User = mongoose.model("User", userSchema)

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

app.listen(PORT, () => console.log(`server running on port ${PORT}`));