const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    enrollmentNumber: { type: String, required: true },
    rollNumber: { type: String, required: true },
    motherName: { type: String, required: true },
    fatherName: { type: String, required: true },
    duration: { type: String, required: true },
    session: { type: String, required: true },
    dob: { type: Date, required: true },
    courseName: { type: String, required: true },
    subjects: [{
        name: { type: String, required: true },
        theoryMarks: { type: Number, required: true },
        practicalMarks: { type: Number, required: true }
    }],
    totalPercentage: { type: Number },
    grade: { type: String },
    dateOfIssue: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);