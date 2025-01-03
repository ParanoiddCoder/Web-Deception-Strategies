import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 8000;

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // your Gmail address
    pass: process.env.EMAIL_PASS,  // your Gmail password or App Password
  },
}); 

// Function to send email notification
const sendEmailNotification = (ip) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'amansolankialt@gmail.com',  // your email where you want the notification
    subject: 'Website Blocked: Maintenance Mode Activated',
    text: `The website has gone down for maintenance due to suspicious activity. IP Address: ${ip}.\n\nPlease investigate.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
app.use(cookieParser());

// Middleware to Handle Blocking Mode
app.use((req, res, next) => {
  if (blockingMode) {
      return res.status(503).send(`
          <html>
              <head><title>System Maintenance</title></head>
              <body>
                  <h1>System is down for maintenance</h1>
                  <p>Expected recovery time: ${blockingResetTime.toLocaleString()}</p>
              </body>
          </html>
      `);
  }
  next();
});

// CORS setup to allow requests from your frontend
app.use(
    cors({
        origin: 'http://localhost:3000', // Replace with your frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add allowed HTTP methods
        credentials: true, // Allow cookies and credentials
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// MongoDB Schema for Intrusion Logs
const intrusionLogSchema = new mongoose.Schema({
    ip: String,
    timestamp: { type: Date, default: Date.now },
});
const IntrusionLog = mongoose.model('IntrusionLog', intrusionLogSchema);

// Variables for Blocking Mode and Deceptive Comments
let intrusionCounter = 0;
let blockingMode = false;
let blockingResetTime = null;
const BLOCKING_PERIOD = 5 * 60 * 1000; // 5 minutes
const deceptiveComments = [
    '<!-- TODO: Remove sensitive debug logs before production -->',
    '<!-- WARNING: Hardcoded API key, replace immediately -->',
    '<!-- Note: Temporary database credentials included for testing -->',
];
const FAKE_URLS = [
    '//TODO: Remove this link for production',
    '//Test link for direct backend access',
    '//devel only',
    '//remove this!',
];

// Route to get deceptive cookies
app.get('/get-deceptive-cookies', (req, res) => {
  const deceptiveCookies = [
    { name: 'session_id', value: 'abc123'},
    //{pass: 'password', value: '123@'},
    { name: 'debug_mode', value: 'true' },
  
  ];

  // Log the cookies to ensure they are correctly being set
  deceptiveCookies.forEach(cookie => {
    console.log(`Deceptive cookie set: ${cookie.name} = ${cookie.value}`);
  });
  // Respond with the cookie names and values
  res.status(200).json(deceptiveCookies);
});
app.use((req, res, next) => {
    const deceptiveCookies = ['session_id', 'debug_mode', 'temporary_user']; // List of deceptive cookies
  
    // Check for the presence of deceptive cookies in the request
    let suspicious = false;
    deceptiveCookies.forEach(cookieName => {
      if (req.cookies[cookieName]) {
        console.log(`Deceptive cookie found: ${cookieName}=${req.cookies[cookieName]}`);
        suspicious = true; // Flag as suspicious if any deceptive cookie is found
      }
    });
  
    // If suspicious cookies are found, log and notify
    if (suspicious) {
      logSuspiciousActivity(req);
      sendEmailNotification(req.ip); // Send an email to notify
    }
  
    next(); // Continue with the request processing
  });
  
  // Function to log suspicious activity (in your database or a file)
  const logSuspiciousActivity = (req) => {
    const suspiciousLog = {
      ip: req.ip,
      cookies: req.cookies,
      url: req.originalUrl,
      timestamp: new Date(),
    };
  
    console.log('Suspicious activity detected:', suspiciousLog);
  };
// Middleware to inject fake comments
const injectFakeCommentMiddleware = (req, res, next) => {
  const originalSend = res.send;

  res.send = (body) => {
    if (typeof body === 'string') {
      const randomFakeURL = FAKE_URLS[Math.floor(Math.random() * FAKE_URLS.length)];
      const fakeComment = `\n<!-- ${randomFakeURL} http://localhost:8000/fake-url-${Date.now()} -->`;
      
      // Log the fake comment to the console
      console.log('Injected Fake Comment:', fakeComment);
      
      // Append the fake comment to the body
      body += fakeComment;
    }
    
    originalSend.call(res, body);
  };

  next();
};

// Apply fake comment middleware to all routes
app.use(injectFakeCommentMiddleware);

// Deceptive Comments Endpoint
app.get('/deceptive-comments', (req, res) => {
    const randomComment = deceptiveComments[Math.floor(Math.random() * deceptiveComments.length)];
    res.status(200).send(randomComment);
});

// Middleware to detect intrusions via fake URLs
app.get('/fake-url-:timestamp', (req, res) => {
    const fakeUrlAccessLog = {
        ip: req.ip,
        timestamp: new Date(),
        url: req.originalUrl,
    };

    console.log('Intrusion detected:', fakeUrlAccessLog);

    // Log to MongoDB
    IntrusionLog.create({ ip: req.ip });

    // Increment counter and enable blocking mode if necessary
    intrusionCounter++;
    if (intrusionCounter > 10) {
        blockingMode = true;
        blockingResetTime = new Date(Date.now() + BLOCKING_PERIOD);
        console.log(`Blocking mode enabled until ${blockingResetTime}`);
        sendEmailNotification(req.ip);
        setTimeout(() => {
            blockingMode = false;
            intrusionCounter = 0;
        }, BLOCKING_PERIOD);
        return res.status(200).send('Blocking mode activated');
    }

    res.status(200).send(`Access logged at ${Date.now()}`);
});

// Check blocking mode status
app.get('/check-blocking-mode', (req, res) => {
    if (blockingMode) {
        return res.status(503).json({
            message: 'System is in blocking mode, please try again later.',
            resetTime: blockingResetTime,
        });
    }
    return res.status(200).json({ message: 'System is operational.' });
});

// PayPal configuration route
app.get('/api/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Serve static files for production
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
} else {
    app.use('/uploads', express.static(path.join(path.resolve(), '/uploads')));
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
