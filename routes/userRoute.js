const express = require("express");
const user_route = express();
const session = require("express-session");

const config = require("../config/config");
const auth = require("../middleware/auth");
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');

// Set up session middleware
user_route.use(session({ secret: config.sessionSecret }));

// Set up view engine for rendering EJS views
user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

// Middleware to parse incoming request bodies
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
user_route.use(express.static('public'));

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/userImages')); // Save to 'userImages' folder
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + file.originalname; // Unique file name
    cb(null, name);
  }
});
const upload = multer({ storage });

// Import user controller for handling routes
const userController = require("../controllers/userController");

// Routes for user operations
user_route.get("/register", auth.isLogout, userController.loadRegister); // Register page
user_route.post("/register", upload.single('image'), userController.insertUser); // Handle registration

user_route.get('/verify', userController.verifyMail); // Email verification route

// Login routes
user_route.get('/', auth.isLogout, userController.loginLoad); // Login page
user_route.get('/login', auth.isLogout, userController.loginLoad); // Login page
user_route.post('/login', userController.verifyLogin); // Handle login

// Home route (requires authentication)
user_route.get('/home', auth.isLogin, userController.loadHome);

// Logout route
user_route.get('/logout', auth.isLogin, userController.userLogout);

// Forgot password routes
user_route.get('/forget', auth.isLogout, userController.forgetLoad); // Forgot password page
user_route.post('/forget', userController.forgetVerify); // Handle forgot password

// Password reset routes
user_route.get('/forget-password', auth.isLogout, userController.forgetPasswordLoad); // Reset password page
user_route.post('/forget-password', userController.resetPassword); // Handle password reset

// Email verification route
user_route.get('/verification', userController.verificationLoad); // Verification page
user_route.post('/verification', userController.sentVerificationLink); // Send verification link

// Edit profile routes
user_route.get('/edit', auth.isLogin, userController.editLoad); // Edit profile page
user_route.post('/edit', upload.single('image'), userController.updateProfile); // Update profile

module.exports = user_route;
