const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { createCanvas, loadImage } = require("canvas");
const QRCode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));


async function generateResultImage(student) {
  const canvas = createCanvas(883, 1280);
  const ctx = canvas.getContext("2d");

  const image = await loadImage("certificate.jpg");
  ctx.drawImage(image, 0, 0, 883, 1280);

  const studentPhoto = await loadImage(student.photo);
  ctx.drawImage(studentPhoto, 700, 335, 120, 150); // (X: 700, Y: 512, Width: 150, Height: 200)
  ctx.fillStyle = "black";

  // Define column positions
  const labelX = 50;
  const valueX = 250;
  let y = 350;
  const lineSpacing = 35;

  function drawText(label, value) {
    ctx.font = "bold 18px Arial"; // Bold for labels
    ctx.fillText(label, labelX, y);
    ctx.font = "18px Arial"; // Normal for values
    ctx.fillText(value, valueX, y);
    y += lineSpacing;
  }

  // Student Details
  drawText("Enrollment No.:", student.enrollmentNumber);
  // drawText("Roll No.:", student.rollNumber);
  drawText("Student Name:", student.studentName);
  // drawText("Duration:", student.duration);
  drawText("Father's Name:", student.fatherName);
  // drawText("Session:", student.session);
  drawText("Mother's Name:", student.motherName);
  drawText("Date of Birth:", new Date(student.dob).toISOString().split("T")[0]);
  drawText("Course Name:", student.courseName);

  // Move Roll Number, Duration, and Session to (700, 335)
  drawText("Roll No.:", student.rollNumber, 700, 335, "blue");
  drawText("Duration:", student.duration, 700, 365, "blue");
  drawText("Session:", student.session, 700, 395, "blue");

  // Table Headers
  let tableY = y + 50;
  ctx.font = "bold 18px Arial";
  ctx.fillText("S.N.", 50, tableY);
  ctx.fillText("Subject", 100, tableY);
  ctx.fillText("Max Marks", 350, tableY);
  ctx.fillText("Theory", 480, tableY);
  ctx.fillText("Practical", 600, tableY);
  ctx.fillText("Total", 720, tableY);
  ctx.fillText("Grade", 800, tableY);

  // Subject Marks
  ctx.font = "18px Arial";
  tableY += 30;
  student.subjects.forEach((subject, index) => {
    
    // Convert marks to numbers before adding
    const theoryMarks = Number(subject.theoryMarks);
    const practicalMarks = Number(subject.practicalMarks);
    const total = theoryMarks + practicalMarks; // Now this will be numeric addition


    ctx.fillText(`${index + 1}`, 50, tableY);
    ctx.fillText(subject.name, 100, tableY);
    ctx.fillText("100", 350, tableY);
    ctx.fillText(`${subject.theoryMarks}`, 480, tableY);
    ctx.fillText(`${subject.practicalMarks}`, 600, tableY);
    ctx.fillText(`${total}`, 720, tableY);
    ctx.fillText(`${subject.grade}`, 800, tableY);
    tableY += 30;
  });

  // Final Scores
  tableY += 30;
  y = tableY;
  drawText("Total Percentage:", `${student.totalPercentage}%`);

  drawText(
    "Date of Issue:",
    new Date(student.dateOfIssue).toISOString().split("T")[0]
  );

  // Generate QR Code
  const qrCodeURL = `https://scait.in/veriy/${student.rollNumber}`;
  const qrCanvas = createCanvas(150, 150);
  await QRCode.toCanvas(qrCanvas, qrCodeURL);
  ctx.drawImage(qrCanvas, 700, 930, 150, 150);

  return canvas.toBuffer("image/png");

  // Save the image
  // const out = fs.createWriteStream('./result.png');
  // const stream = canvas.createPNGStream();
  // stream.pipe(out);

  // out.on('finish', () => console.log('The PNG file was created with a QR code.'));
}
async function generateDiplomaCertificate(student) {
  const canvas = createCanvas(1125, 750);
  const ctx = canvas.getContext("2d");

  // Load the uploaded diploma certificate template
  const diplomaImage = await loadImage("diploma.jpg");
  ctx.drawImage(diplomaImage, 0, 0, 1125, 750);

  ctx.fillStyle = "blue";
  ctx.font = "bold 18px Arial";

  // Fill in the student details
  ctx.fillText(student.studentName, 300, 280);
  ctx.fillText(student.fatherName, 300, 320);
  ctx.fillText(new Date(student.dob).toISOString().split("T")[0], 900, 320);
  ctx.fillText(student.courseName, 400, 360);
  ctx.fillText(student.duration, 200, 440);
  ctx.fillText(student.enrollmentNumber, 200, 488);
  ctx.fillText(
    new Date(student.dateOfIssue).toISOString().split("T")[0],
    200,
    528
  );
  ctx.fillText(student.overallGrade, 900, 441);
  ctx.fillText("Student Computer Academy", 200, 401);

  // Generate QR Code
  const qrCodeURL = `https://scait.in/veriy/${student.rollNumber}`;
  const qrCanvas = createCanvas(125, 125);
  await QRCode.toCanvas(qrCanvas, qrCodeURL);
  ctx.drawImage(qrCanvas, 100, 110, 125, 125);

  //Load photo
  const studentPhoto = await loadImage(student.photo);
  ctx.drawImage(studentPhoto, 900, 110, 100, 120); // (X: 700, Y: 512, Width: 150, Height: 200)

  // Save the image
//   const out = fs.createWriteStream("./result.png");
//   const stream = canvas.createPNGStream();
//   stream.pipe(out);
//   out.on("finish", () =>
//     console.log("The PNG file was created with a student photo and QR code.")
//   );

    return canvas.toBuffer('image/png');
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

app.post("/generate-diploma", async (req, res) => {
  try {
    const imageBuffer = await generateDiplomaCertificate(req.body);

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

app.get('/', async (req, res) => res.json({data : "hello"}))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
