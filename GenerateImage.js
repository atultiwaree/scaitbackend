// async function generateResultImage(student) {
//     const canvas = createCanvas(883, 1280);
//     const ctx = canvas.getContext('2d');

//     const image = await loadImage('certificate.jpg');
//     ctx.drawImage(image, 0, 0, 883, 1280);

//     ctx.fillStyle = 'black';

//     // Define column positions
//     const labelX = 50;
//     const valueX = 250;
//     let y = 350;
//     const lineSpacing = 35;

//     function drawText(label, value) {
//         ctx.font = 'bold 18px Arial';  // Bold for labels
//         ctx.fillText(label, labelX, y);
//         ctx.font = '18px Arial';  // Normal for values
//         ctx.fillText(value, valueX, y);
//         y += lineSpacing;
//     }

//     // Student Details
//     drawText("Enrollment No.:", student.enrollmentNumber);
//     drawText("Roll No.:", student.rollNumber);
//     drawText("Student Name:", student.studentName);
//     drawText("Duration:", student.duration);
//     drawText("Father's Name:", student.fatherName);
//     drawText("Session:", student.session);
//     drawText("Mother's Name:", student.motherName);
//     drawText("Date of Birth:", student.dob.toISOString().split('T')[0]);
//     drawText("Course Name:", student.courseName);

//     // Table Headers
//     let tableY = y + 50;
//     ctx.font = 'bold 18px Arial';
//     ctx.fillText("S.N.", 50, tableY);
//     ctx.fillText("Subject", 120, tableY);
//     ctx.fillText("Max Marks", 350, tableY);
//     ctx.fillText("Theory", 480, tableY);
//     ctx.fillText("Practical", 600, tableY);
//     ctx.fillText("Total", 720, tableY);
//     ctx.fillText("Grade", 800, tableY)

//     // Subject Marks
//     ctx.font = '18px Arial';
//     tableY += 30; 
//     student.subjects.forEach((subject, index) => {
//         let total = subject.theoryMarks + subject.practicalMarks;
//         ctx.fillText(`${index + 1}`, 50, tableY);
//         ctx.fillText(subject.name, 120, tableY);
//         ctx.fillText("100", 350, tableY);
//         ctx.fillText(`${subject.theoryMarks}`, 480, tableY);
//         ctx.fillText(`${subject.practicalMarks}`, 600, tableY);
//         ctx.fillText(`${total}`, 720, tableY);
//         tableY += 30;
//     });

//     // Final Scores
//     tableY += 30;
//     y = tableY;
//     drawText("Total Percentage:", `${student.totalPercentage.toFixed(2)}%`);
//     drawText("Grade:", student.grade);
//     drawText("Date of Issue:", student.dateOfIssue.toISOString().split('T')[0]);

//     // Generate QR Code
//     const qrCodeURL = `https://scait.in/veriy/${student.rollNumber}`;
//     const qrCanvas = createCanvas(150, 150);
//     await QRCode.toCanvas(qrCanvas, qrCodeURL);
//     ctx.drawImage(qrCanvas, 700, 1100, 150, 150);

//     // Save the image
//     const out = fs.createWriteStream('./result.png');
//     const stream = canvas.createPNGStream();
//     stream.pipe(out);
//     out.on('finish', () => console.log('The PNG file was created with a QR code.'));
// }

// // Example student data
// const student = {
//     enrollmentNumber: "SUBIN-UPUP1417350444939467124403W",
//     rollNumber: "12345",
//     studentName: "John Doe",
//     duration: "1 Year",
//     fatherName: "Father's Name",
//     session: "2022-2023",
//     motherName: "Mother's Name",
//     dob: new Date("2000-01-01"),
//     courseName: "ADCA",
//     subjects: [
//         { name: "Computer Fundamental", theoryMarks: 45, practicalMarks: 40 , grade},
//         { name: "Operating System, Typing", theoryMarks: 50, practicalMarks: 45 , grade},
//         { name: "Ms Word, Excel, PowerPoint", theoryMarks: 48, practicalMarks: 47 , grade},
//         { name: "Programming (HTML)", theoryMarks: 42, practicalMarks: 43 , grade},
//         { name: "Photoshop, Corel Draw", theoryMarks: 49, practicalMarks: 46 , grade},
//         { name: "Accounting, Tally", theoryMarks: 47, practicalMarks: 48, grade }
//     ],
//     totalPercentage: 85.5,
//     grade: "A",
//     dateOfIssue: new Date()
// };

// // Generate the image
// generateResultImage(student);
