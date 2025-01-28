const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Student = require('./models/Student');

const result = require('./GenerateImage')

const app = express();
const PORT = process.env.PORT ||8000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/studentAcademy', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.post('/api/students', async (req, res) => {
    const { enrollmentNumber, rollNumber, motherName, fatherName, duration, session, dob, courseName, subjects } = req.body;

    const totalMarks = subjects.reduce((acc, subject) => acc + subject.theoryMarks + subject.practicalMarks, 0);
    const totalPercentage = (totalMarks / (subjects.length * 100)) * 100;

    let grade;
    if (totalPercentage >= 80) grade = 'A';
    else if (totalPercentage >= 70) grade = 'B';
    else if (totalPercentage >= 60) grade = 'C';
    else if (totalPercentage >= 50) grade = 'D';
    else grade = 'E';

    const student = new Student({
        enrollmentNumber,
        rollNumber,
        motherName,
        fatherName,
        duration,
        session,
        dob,
        courseName,
        subjects,
        totalPercentage,
        grade
    });

    await student.save();
    res.status(201).json(student);
});

app.get('/api/students/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.json(student);
});

app.get("/generateResult", async (req, res) => {
    console.log("Generating the result")

    result()

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});