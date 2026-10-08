const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.log("MongoDb connection error: ", error);
});

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Added /api prefix to match your frontend requests
app.get("/api/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post("/api/students", async (req, res) => {
    const newStudent = new Student({
        name: req.body.name,
        age: req.body.age,
        course: req.body.course,
    });

    const saved = await newStudent.save();
    res.json(saved);
});

app.delete("/api/students/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Students Deleted" });
});

app.put("/api/students/:id", async (req, res) => {
    const updated = await Student.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            course: req.body.course,
            age: req.body.age,
        },
        { new: true }
    );
    res.json(updated);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});