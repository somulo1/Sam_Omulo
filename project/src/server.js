import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to handle all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Email API!');
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'mcomulosammy37@gmail.com',
    pass: 'inss cfcv agtz njhn'
  }
});

// Endpoint to send email
app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;
  const subject = `Contact Form Submission from ${name}`;
  const text = `You have received a new message from ${name} (${email}):\n\n${message}`;

  try {
    await transporter.sendMail({
      from: 'mcomulosammy37@gmail.com',
      to: 'mcomulosammy37@gmail.com',
      subject,
      text
    });
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});