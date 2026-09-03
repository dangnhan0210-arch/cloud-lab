const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ========================================
// GET /api/hello
// ========================================
app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend is running successfully!"
    });
});

// ========================================
// CÂU 36: GET /api/students
// Lấy danh sách sinh viên
// ========================================
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Cannot get students",
            error: error.message
        });
    }
});

// ========================================
// CÂU 37: POST /api/students
// Thêm sinh viên
// ========================================
app.post("/api/students", async (req, res) => {
    try {
        const { studentId, name, email } = req.body;

        const student = await Student.create({
            studentId,
            name,
            email
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            message: "Cannot create student",
            error: error.message
        });
    }
});

// ========================================
// CÂU 38: PUT /api/students/:id
// Cập nhật sinh viên
// ========================================
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({
            message: "Cannot update student",
            error: error.message
        });
    }
});

// ========================================
// CÂU 39: DELETE /api/students/:id
// Xóa sinh viên
// ========================================
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully",
            student
        });
    } catch (error) {
        res.status(400).json({
            message: "Cannot delete student",
            error: error.message
        });
    }
});

// ========================================
// KẾT NỐI MONGODB
// ========================================
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });