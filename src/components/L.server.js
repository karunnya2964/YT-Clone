// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3001;

app.use(bodyParser.json());

let userAttempts = {}; // Store failed login attempts

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const maxAttempts = 5;
  const lockoutDuration = 60 * 60 * 1000; // 1 hour in milliseconds

  // Check if the user has reached the maximum number of login attempts
  if (userAttempts[username] >= maxAttempts) {
    // Block the account and send notification email
    sendEmail(username, 'Account Blocked', 'Your account has been blocked due to multiple failed login attempts.');
    setTimeout(() => {
      // Unblock the account after the lockout duration
      delete userAttempts[username];
      sendEmail(username, 'Account Unblocked', 'Your account has been unblocked. You can now attempt to log in again.');
    }, lockoutDuration);

    return res.status(401).json({ message: 'Account blocked. Please check your email for further instructions.' });
  }

  // Simulated authentication logic - Replace with your actual authentication mechanism
  if (authenticateUser(username, password)) {
    // Successful login, reset failed attempts
    userAttempts[username] = 0;
    return res.status(200).json({ message: 'Login successful!' });
  } else {
    // Increment failed login attempts
    userAttempts[username] = (userAttempts[username] || 0) + 1;
    // Check if this is the third consecutive failed attempt
    if (userAttempts[username] === 3) {
      // Send notification email
      sendEmail(username, 'Consecutive Failed Login Attempts', 'There have been three consecutive failed login attempts on your account.');
    }
    return res.status(401).json({ message: 'Incorrect username or password.' });
  }
});

function authenticateUser(username, password) {
  // Simulated authentication logic - Replace with your actual authentication mechanism
  return username === 'demo' && password === 'password';
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
