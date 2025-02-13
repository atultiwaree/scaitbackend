const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { createCanvas, loadImage } = require("canvas");
const QRCode = require("qrcode");
const cloudinary = require("cloudinary").v2;

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true, parameterLimit: 1000000 }));

// MongoDB Atlas Connection
const dbURI = "mongodb+srv://studentscait:A2ul%40scait@cluster0.j30vy.mongodb.net/student?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbURI)
  .then((e) => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schema
const subjectSchema = new mongoose.Schema({
  name: String,
  theoryMarks: String,
  practicalMarks: String,
  grade: String,
});


const studentSchema = new mongoose.Schema({
  enrollmentNumber: String,
  rollNumber: String,
  studentName: String,
  duration: String,
  fatherName: String,
  session: String,
  motherName: String,
  dob: Date,
  courseName: String,
  subjects: [subjectSchema],
  totalPercentage: String,
  overallGrade: String,
  dateOfIssue: Date,
  photo: String, // URL or base64 string for the student's photo
});

const Student = mongoose.model("Result", studentSchema);

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dn8ghigvk", // Replace with your Cloudinary cloud name
  api_key: "199138848194996", // Replace with your Cloudinary API key
  api_secret: "Nvgk4QLOKqhbAgto3d7gdLpPBjk", // Replace with your Cloudinary API secret
});

// Function to upload image to Cloudinary and return URL
async function uploadImageToCloudinary(base64Data) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      `data:image/png;base64,${base64Data}`,
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log("Cloudinary upload result:", result); // Log the result
          resolve(result.secure_url);
        }
      }
    );
  });
}

// Image Generation Functions (unchanged)
async function generateResultImage(student) {
  const canvas = createCanvas(883, 1280);
  const ctx = canvas.getContext("2d");

  const image = await loadImage("certificate.jpg");
  ctx.drawImage(image, 0, 0, 883, 1280);

  const studentPhoto = await loadImage(student.photo);
  ctx.drawImage(studentPhoto, 700, 335, 120, 150);
  ctx.fillStyle = "black";

  const labelX = 50;
  const valueX = 250;
  let y = 350;
  const lineSpacing = 35;

  function drawText(label, value) {
    ctx.font = "bold 18px Arial";
    ctx.fillText(label, labelX, y);
    ctx.font = "18px Arial";
    ctx.fillText(value, valueX, y);
    y += lineSpacing;
  }

  drawText("Enrollment No.:", student.enrollmentNumber);
  drawText("Student Name:", student.studentName);
  drawText("Father's Name:", student.fatherName);
  drawText("Mother's Name:", student.motherName);
  drawText("Date of Birth:", new Date(student.dob).toISOString().split("T")[0]);
  drawText("Course Name:", student.courseName);

  drawText("Roll No.:", student.rollNumber, 700, 335, "blue");
  drawText("Duration:", student.duration, 700, 365, "blue");
  drawText("Session:", student.session, 700, 395, "blue");

  let tableY = y + 50;
  ctx.font = "bold 18px Arial";
  ctx.fillText("S.N.", 50, tableY);
  ctx.fillText("Subject", 100, tableY);
  ctx.fillText("Max Marks", 350, tableY);
  ctx.fillText("Theory", 480, tableY);
  ctx.fillText("Practical", 600, tableY);
  ctx.fillText("Total", 720, tableY);
  ctx.fillText("Grade", 800, tableY);

  ctx.font = "18px Arial";
  tableY += 30;
  student.subjects.forEach((subject, index) => {
    const theoryMarks = Number(subject.theoryMarks);
    const practicalMarks = Number(subject.practicalMarks);
    const total = theoryMarks + practicalMarks;

    ctx.fillText(`${index + 1}`, 50, tableY);
    ctx.fillText(subject.name, 100, tableY);
    ctx.fillText("100", 350, tableY);
    ctx.fillText(`${subject.theoryMarks}`, 480, tableY);
    ctx.fillText(`${subject.practicalMarks}`, 600, tableY);
    ctx.fillText(`${total}`, 720, tableY);
    ctx.fillText(`${subject.grade}`, 800, tableY);
    tableY += 30;
  });

  tableY += 30;
  y = tableY;
  drawText("Total Percentage:", `${student.totalPercentage}%`);
  drawText("Date of Issue:", new Date(student.dateOfIssue).toISOString().split("T")[0]);

  const qrCodeURL = `https://scait.in/veriy/${student.rollNumber}`;
  const qrCanvas = createCanvas(150, 150);
  await QRCode.toCanvas(qrCanvas, qrCodeURL);
  ctx.drawImage(qrCanvas, 700, 930, 150, 150);

  return canvas.toBuffer("image/png");
}

async function generateDiplomaCertificate(student) {
  const canvas = createCanvas(1125, 750);
  const ctx = canvas.getContext("2d");

  const diplomaImage = await loadImage("diploma.jpg");
  ctx.drawImage(diplomaImage, 0, 0, 1125, 750);

  ctx.fillStyle = "blue";
  ctx.font = "bold 18px Arial";

  ctx.fillText(student.studentName, 300, 280);
  ctx.fillText(student.fatherName, 300, 320);
  ctx.fillText(new Date(student.dob).toISOString().split("T")[0], 900, 320);
  ctx.fillText(student.courseName, 400, 360);
  ctx.fillText(student.duration, 200, 440);
  ctx.fillText(student.enrollmentNumber, 200, 488);
  ctx.fillText(new Date(student.dateOfIssue).toISOString().split("T")[0], 200, 528);
  ctx.fillText(student.overallGrade, 900, 441);
  ctx.fillText("Student Computer Academy", 200, 401);

  const qrCodeURL = `https://scait.in/veriy/${student.rollNumber}`;
  const qrCanvas = createCanvas(125, 125);
  await QRCode.toCanvas(qrCanvas, qrCodeURL);
  ctx.drawImage(qrCanvas, 100, 110, 125, 125);

  const studentPhoto = await loadImage(student.photo);
  ctx.drawImage(studentPhoto, 900, 110, 100, 120);

  return canvas.toBuffer("image/png");
}

// API Endpoint to Generate Image
app.post("/generate-image", async (req, res) => {
  try {
    const imageBuffer = await generateResultImage(req.body);

    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="result.png"',
    });

    res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});


// Updated /save-student endpoint to handle image upload
app.post("/save-student", async (req, res) => {
  try {
    const studentData = req.body;

    if (studentData.photo) {
      const base64Data = studentData.photo.replace(/^data:image\/\w+;base64,/, "");

      // Validate the base64 string
      const isValidBase64 = (str) => {
        try {
          return Buffer.from(str, "base64").toString("base64") === str;
        } catch (err) {
          return false;
        }
      };

      if (!isValidBase64(base64Data)) {
        return res.status(400).json({ error: "Invalid base64 image data" });
      }

      // Upload the image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(base64Data);
      studentData.photo = imageUrl; // Save the Cloudinary URL to the database
    }

    // Save student data to MongoDB
    const newStudent = new Student(studentData);
    await newStudent.save();

    res.status(201).json({ message: "Student saved successfully", student: newStudent, status : 200 });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving student data");
  }
});



// API to generate certificate
app.post("/generate-certificate", async (req, res) => {
  try {
    const { enrollmentNumber } = req.body;

    // Fetch student data from MongoDB
    const student = await Student.findOne({ enrollmentNumber });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Generate certificate
    const imageBuffer = await generateResultImage(student);

    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="certificate.png"',
    });

    return res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating certificate");
  }
});

// API to generate diploma
app.post("/generate-diploma", async (req, res) => {
  try {
    const { enrollmentNumber } = req.body;
    console.log("Requested enrollmentNumber:", enrollmentNumber); // Log the enrollment number

   
    // Fetch student data from MongoDB
    const student = await Student.findOne({ enrollmentNumber });
    if (!student) {
      console.error("Student not found for enrollmentNumber:", enrollmentNumber);
      return res.status(404).json({ error: "Student not found" });
    }


    // Generate diploma
    const imageBuffer = await generateDiplomaCertificate(student);

    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="diploma.png"',
    });

    res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating diploma");
  }
});


app.get("/", async (req, res) => res.json({ data: "hello there" }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});