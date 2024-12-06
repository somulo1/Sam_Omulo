import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

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