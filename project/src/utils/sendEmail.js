import nodemailer from 'nodemailer';

// Configure email settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'mcomulosammy37@gmail.com', // your email
    pass: 'inss cfcv agtz njhn', // your app-specific password
  },
});

// Function to send email
export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'mcomulosammy37@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };

  return transporter.sendMail(mailOptions);
};
