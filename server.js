const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Cache connection for serverless environment to prevent 500 crashes
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        throw error;
    }
}

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.get("/api/students", async (req, res) => {
    try {
        await connectDB();
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

app.post("/api/students", async (req, res) => {
    try {
        await connectDB();
        const newStudent = new Student({
            name: req.body.name,
            age: req.body.age,
            course: req.body.course,
        });

        const saved = await newStudent.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: "Failed to add student" });
    }
});

app.delete("/api/students/:id", async (req, res) => {
    try {
        await connectDB();
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Students Deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete student" });
    }
});

app.put("/api/students/:id", async (req, res) => {
    try {
        await connectDB();
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
    } catch (error) {
        res.status(500).json({ error: "Failed to update student" });
    }
});

// For local development testing
if (process.env.NODE_ENV !== "production") {
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
}

// Export for Vercel serverless functions
module.exports = app;