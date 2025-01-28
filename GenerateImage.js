const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');  // Import the QR Code module
const fs = require('fs');

async function generateResultImage(student) {
    // Set canvas size (matches the template image size)
    const canvas = createCanvas(883, 1280);
    const ctx = canvas.getContext('2d');

    // Load the template image
    const image = await loadImage('certificate.jpg');
    ctx.drawImage(image, 0, 0, 883, 1280);

    // Set text properties
    ctx.fillStyle = 'black';
    ctx.font = '18px Arial'; 
    ctx.textAlign = 'left';

    // Define column positions
    const labelX = 50; // Labels on the left
    const valueX = 250; // Values aligned beside labels

    // Student details (Top Section)
    let y = 350; // Starting Y position
    const lineSpacing = 35; // Vertical spacing between lines

    ctx.fillText("Enrollment No.:", labelX, y);
    ctx.fillText(student.enrollmentNumber, valueX, y);
    
    ctx.fillText("Roll No.:", labelX, (y += lineSpacing));
    ctx.fillText(student.rollNumber, valueX, y);
    
    ctx.fillText("Student Name:", labelX, (y += lineSpacing));
    ctx.fillText(student.studentName, valueX, y);
    
    ctx.fillText("Duration:", labelX, (y += lineSpacing));
    ctx.fillText(student.duration, valueX, y);
    
    ctx.fillText("Father's Name:", labelX, (y += lineSpacing));
    ctx.fillText(student.fatherName, valueX, y);
    
    ctx.fillText("Session:", labelX, (y += lineSpacing));
    ctx.fillText(student.session, valueX, y);
    
    ctx.fillText("Mother's Name:", labelX, (y += lineSpacing));
    ctx.fillText(student.motherName, valueX, y);
    
    ctx.fillText("Date of Birth:", labelX, (y += lineSpacing));
    ctx.fillText(student.dob.toISOString().split('T')[0], valueX, y);
    
    ctx.fillText("Course Name:", labelX, (y += lineSpacing));
    ctx.fillText(student.courseName, valueX, y);

    // Table Headers
    let tableY = y + 50; // Spacing before table
    ctx.fillText("S.N.", 50, tableY);
    ctx.fillText("Subject", 120, tableY);
    ctx.fillText("Max Marks", 350, tableY);
    ctx.fillText("Theory", 480, tableY);
    ctx.fillText("Practical", 600, tableY);
    ctx.fillText("Total", 720, tableY);
    
    // Subject Marks
    tableY += 30; 
    student.subjects.forEach((subject, index) => {
        let total = subject.theoryMarks + subject.practicalMarks;
        ctx.fillText(`${index + 1}`, 50, tableY);
        ctx.fillText(subject.name, 120, tableY);
        ctx.fillText("100", 350, tableY); // Assuming max 100 marks
        ctx.fillText(`${subject.theoryMarks}`, 480, tableY);
        ctx.fillText(`${subject.practicalMarks}`, 600, tableY);
        ctx.fillText(`${total}`, 720, tableY);
        tableY += 30;
    });

    // Final Scores
    tableY += 30;
    ctx.fillText(`Total Percentage:`, labelX, tableY);
    ctx.fillText(`${student.totalPercentage.toFixed(2)}%`, valueX, tableY);
    
    ctx.fillText("Grade:", labelX, (tableY += lineSpacing));
    ctx.fillText(student.grade, valueX, tableY);
    
    ctx.fillText("Date of Issue:", labelX, (tableY += lineSpacing));
    ctx.fillText(student.dateOfIssue.toISOString().split('T')[0], valueX, tableY);

    // Generate QR Code
    const qrCodeURL = `https://scait.in/veriy/${student.rollNumber}`;
    const qrCanvas = createCanvas(150, 150); // Small QR Code Canvas
    await QRCode.toCanvas(qrCanvas, qrCodeURL);

    // Draw the QR Code on the certificate
    ctx.drawImage(qrCanvas, 620, 880, 150, 150); // Adjust position (bottom-right)

    // Save the image
    const out = fs.createWriteStream('./result.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('The PNG file was created with a QR code.'));
}

// Example student data
const student = {
    enrollmentNumber: "SUBIN-UPUP1417350444939467124403W",
    rollNumber: "12345",
    studentName: "John Doe",
    duration: "1 Year",
    fatherName: "Father's Name",
    session: "2022-2023",
    motherName: "Mother's Name",
    dob: new Date("2000-01-01"),
    courseName: "ADCA",
    subjects: [
        { name: "Computer Fundamental", theoryMarks: 45, practicalMarks: 40 },
        { name: "Operating System, Typing", theoryMarks: 50, practicalMarks: 45 },
        { name: "Ms Word, Excel, PowerPoint", theoryMarks: 48, practicalMarks: 47 },
        { name: "Programming (HTML)", theoryMarks: 42, practicalMarks: 43 },
        { name: "Photoshop, Corel Draw", theoryMarks: 49, practicalMarks: 46 },
        { name: "Accounting, Tally", theoryMarks: 47, practicalMarks: 48 }
    ],
    totalPercentage: 85.5,
    grade: "A",
    dateOfIssue: new Date()
};

// Generate the image
generateResultImage(student);
