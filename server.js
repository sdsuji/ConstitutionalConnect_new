require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Admin = require('./models/Admin');
const User = require('./models/User');
const Newsletter = require('./models/Newsletter');
const Module = require('./models/Module'); 
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserProgress = require('./models/UserProgress');
const router = express.Router();



const app = express();
const port = process.env.PORT ||3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); 

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token and decode it to get user information
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }

        req.user = user; 
        next();
    });
};
module.exports = authenticateToken;


// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landingPage.html'));
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Admin Login
app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: 'Admin not found!' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password!' });

        // Generate JWT token for admin login
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// User Registration
app.post('/user/register', async (req, res) => {
    const { name, profession, institution, email, phone, password, confirmPassword } = req.body;
    try {
        if (email === 'sujitacbe2018@gmail.com') {
            return res.status(400).json({ message: 'Cannot use this email ID.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists!' });

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) return res.status(400).json({ message: 'Phone number already exists!' });

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            profession,
            institution,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// User Login
app.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password!' });

        // Generate JWT token for user login
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// Admin Newsletter Creation
app.post('/admin/newsletter', async (req, res) => {
    const { heading, content } = req.body;

    if (!heading || !content) {
        return res.status(400).json({ message: 'Heading and content are required.' });
    }

    try {
        // Store the newsletter 
        const newNewsletter = new Newsletter({
            heading,
            content,
        });

        await newNewsletter.save();
        res.status(200).json({ message: 'Newsletter created successfully!' });
    } catch (error) {
        console.error('Error during newsletter creation:', error);
        res.status(500).json({ message: 'An error occurred while creating the newsletter.' });
    }
});

// Fetch User Newsletters 
app.get('/user/newsletters', async (req, res) => {
    try {
        const newsletters = await Newsletter.find();
        const response = newsletters.map((newsletter) => ({
            heading: newsletter.heading,
            content: newsletter.content,
        }));
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching newsletters:', error);
        res.status(500).json({ message: 'An error occurred while fetching newsletters.' });
    }
});

// Fetch the total number of users
app.get('/admin/users/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({ count: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ message: 'Error fetching user count.' });
    }
});

// Route to get all newsletters
app.get('/admin/newsletters', async (req, res) => {
    try {
        const newsletters = await Newsletter.find();
        res.json(newsletters);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching newsletters' });
    }
});

// Route to get a specific newsletter by ID
app.get('/admin/newsletter/:id', async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);
        if (!newsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.json(newsletter);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching newsletter' });
    }
});

// Route to update a specific newsletter by ID
app.put('/admin/newsletter/:id', async (req, res) => {
    try {
        const updatedNewsletter = await Newsletter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNewsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.json(updatedNewsletter);
    } catch (error) {
        res.status(500).json({ message: 'Error updating newsletter' });
    }
});

// Route to delete a specific newsletter by ID
app.delete('/admin/newsletter/:id', async (req, res) => {
    try {
        const deletedNewsletter = await Newsletter.findByIdAndDelete(req.params.id);
        if (!deletedNewsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.json({ message: 'Newsletter deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting newsletter' });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Save user ID to request for later use
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

// Fetch User Profile
app.get('/user/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); 
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Update User Profile
app.put('/user/profile', verifyToken, async (req, res) => {
    const { name, profession, institution, phone } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, profession, institution, phone },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from the response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

//password reset
app.post('/user/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

        // Store OTP in the database
        const user = await User.findOneAndUpdate(
            { email },
            { otp, otpExpiry: Date.now() + 10 * 60 * 1000 }, // 10-minute expiry
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD, 
            },
        });

        // Email details
        const mailOptions = {
            from: process.env.EMAIL, 
            to: email, 
            subject: 'Your OTP for Password Reset',
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending OTP.' });
    }
});

//resetpassword 
app.post('/user/reset-password', async (req, res) => {
    const { otp, password } = req.body;

    if (!otp || !password) {
        return res.status(400).json({ message: 'OTP and password are required.' });
    }

    try {
        
        const user = await User.findOne({
            otp,
            otpExpiry: { $gt: Date.now() }, 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user's password and clear OTP
        user.password = hashedPassword;
        user.otp = undefined; 
        user.otpExpiry = undefined; 
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

//display users in admin dashboard
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({}, "name profession institution email phone"); 
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching users");
    }
});

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, 'uploads/images'); // Images are saved to 'uploads/images'
        } else if (file.mimetype.startsWith('video')) {
            cb(null, 'uploads/videos'); // Videos are saved to 'uploads/videos'
        } else if (file.mimetype === 'application/pdf') {
            cb(null, 'uploads/pdfs'); // PDFs are saved to 'uploads/pdfs'
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Set up multer upload
const upload = multer({ storage: storage });

// Route to handle module addition
app.post(
    '/api/admin/addModule',
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { title, description, quiz } = req.body;

            // Parse the quiz from JSON
            const quizData = JSON.parse(quiz);

            // Save module to the database
            const module = new Module({
                title,
                description,
                image: req.files.image[0].path,
                video: req.files.video[0].path,
                pdf: req.files.pdf[0].path,
                quiz: quizData,
            });

            await module.save();
            res.status(200).json({ message: 'Module added successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add module' });
        }
    }
);

// Define routes (move the '/api/modules' route here)
app.get('/api/modules', async (req, res) => {
    try {
        const modules = await Module.find();
        res.status(200).json(modules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch modules' });
    }
});

app.get('/api/modules/:moduleId', async (req, res) => {
    const { moduleId } = req.params;
    try {
        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.json(module);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching module details' });
    }
});

//delete by admin
// Route to fetch all modules
app.get('/api/admin/getModules', async (req, res) => {
    try {
        const modules = await Module.find();
        res.status(200).json({ modules });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch modules' });
    }
});

// Route to delete a module by ID
app.delete('/api/admin/deleteModule/:id', async (req, res) => {
    try {
        const moduleId = req.params.id;
        const module = await Module.findByIdAndDelete(moduleId);
        
        if (!module) {
            return res.status(404).json({ success: false, message: 'Module not found' });
        }
        
        res.status(200).json({ success: true, message: 'Module deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete module' });
    }
});

// In your server.js or routes file
app.post('/api/userProgress/:moduleId', async (req, res) => {
    const moduleId = req.params.moduleId;
    const { score, responses } = req.body;

    if (!score || !responses) {
        return res.status(400).json({ message: 'Score and responses are required' });
    }

    try {
        // Assuming you are using a UserProgress model for saving user data
        const userProgress = await UserProgress.findOneAndUpdate(
            { moduleId: moduleId }, 
            { score: score, responses: responses }, 
            { upsert: true, new: true } 
        );

        res.status(200).json(userProgress); 
    } catch (error) {
        console.error('Error saving user progress:', error);
        res.status(500).json({ message: 'Error saving progress', error: error.message });
    }
});


// Endpoint to get user quiz progress
app.get('/api/userProgress/:moduleId', async (req, res) => {
    const { moduleId } = req.params;

    // Fetch the user's progress for the specific module
    const progress = await UserProgress.findOne({ userId: req.user._id, moduleId });

    if (progress) {
        res.json(progress);
    } else {
        res.json({ message: 'No progress found' });
    }
});

app.get('/api/modules/:id', async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (module) {
            res.json({ pdf: module.pdf });  // or wherever you store the PDF URL
        } else {
            res.status(404).json({ message: 'Module not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


  


// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
