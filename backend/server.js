require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');       // For Password Security
const nodemailer = require('nodemailer'); // For Emails
const multer = require('multer');         // For File Uploads
const path = require('path');             // Required for file paths
const fs = require('fs');                 // Required for file system operations

const app = express();
app.use(express.json());
app.use(cors());

// Serve the 'uploads' folder publicly so frontend can access files
app.use('/uploads', express.static('uploads')); 

// 1. MONGODB CONNECTION
const MONGO_URI = 'mongodb://127.0.0.1:27017/vrhere_db'; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- MULTER CONFIGURATION (FILE UPLOADS) ---
// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save to backend/uploads
    },
    filename: function (req, file, cb) {
        // Create unique filename: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 2. EMAIL CONFIGURATION
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // REPLACE with real Gmail
        pass: 'your-app-password'      // REPLACE with App Password
    }
});

// 3. DEFINE SCHEMAS

// USER SCHEMA
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String }, 
    phone: String,
    role: { type: String, default: 'client' }, // client, admin, employee
    resetToken: String,
    resetTokenExpiry: Date,
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// SERVICE TEMPLATE SCHEMA (Master Library for WBS)
const ServiceTemplateSchema = new mongoose.Schema({
    name: String, // e.g., "Pvt Ltd Registration"
    description: String,
    tasks: [{
        taskCode: String, // PL-01
        name: String,     // Client Onboarding
        ownerRole: String,// Manager
        subTasks: [{
            code: String, // PL-01.1
            name: String, // Create Client Master
            makerRole: String, // Jr Executive
            checkerRole: String, // Sr Executive
            duration: String, // 0.5 day
            dependency: String
        }]
    }]
});
const ServiceTemplate = mongoose.model('ServiceTemplate', ServiceTemplateSchema);

// PROJECT SCHEMA (Updated for WBS / Tasks)
const ProjectSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    status: { type: String, default: 'New' },
    amount_paid: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    // WBS TASKS
    tasks: [{
        taskCode: String,
        name: String,
        status: { type: String, default: 'Pending' }, // Pending, In Progress, Completed
        owner: { type: String, default: 'Unassigned' }, 
        subTasks: [{
            code: String,
            name: String,
            maker: { type: String, default: 'Unassigned' }, // Assigned Employee Name
            checker: { type: String, default: 'Unassigned' }, // Assigned Employee Name
            status: { type: String, default: 'Pending' }, 
            duration: String,
            startDate: Date,
            endDate: Date
        }]
    }]
});
const Project = mongoose.model('Project', ProjectSchema);

// PAYMENT SCHEMA
const PaymentSchema = new mongoose.Schema({
    order_id: String,
    amount: Number,
    status: { type: String, default: 'created' },
    client_email: String,
    createdAt: { type: Date, default: Date.now }
});
const Payment = mongoose.model('Payment', PaymentSchema);

// 4. RAZORPAY SETUP
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RuKdTFadwm3UGT',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'Jyr2ugxAltrrnIx0gGVyrt5R'
});

// ================= API ROUTES =================

// A. REGISTER / CREATE USER (Auto-called during Payment)
app.post('/api/payment/order', async (req, res) => {
    try {
        const { amount, client_name, client_email, client_mobile, service_name } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };
        const order = await razorpay.orders.create(options);

        // Check if user exists
        let user = await User.findOne({ email: client_email });
        if (!user) {
            // Create temporary password logic
            const tempPassword = Math.random().toString(36).slice(-8); 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(tempPassword, salt);

            // Generate Set Password Token
            const setToken = Math.floor(100000 + Math.random() * 900000).toString();
            const tokenExpiry = Date.now() + 24 * 3600000; // 24 Hours

            user = new User({
                name: client_name,
                email: client_email,
                phone: client_mobile,
                role: 'client',
                password: hashedPassword,
                resetToken: setToken,
                resetTokenExpiry: tokenExpiry
            });
            await user.save();

            // Log the link for debugging
            console.log(`\n>>> 🔐 SET PASSWORD LINK: http://localhost:5173/set-password?email=${client_email}&token=${setToken} \n`);
        }

        // Create Project & Payment
        const newProject = new Project({
            client: user._id,
            title: service_name,
            status: 'New',
            amount_paid: amount,
            progress: 10
        });
        await newProject.save();

        const newPayment = new Payment({
            order_id: order.id,
            amount: amount,
            status: 'created',
            client_email: client_email
        });
        await newPayment.save();

        res.json(order);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server Error");
    }
});

// B. SECURE LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // If user has a password, verify it
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        res.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// C. FORGOT PASSWORD
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetToken = otp;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // Log OTP to console
        console.log(`\n>>> 🔑 RESET OTP for ${email}: ${otp} \n`);

        res.json({ success: true, message: "OTP sent (Check Console)" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// D. RESET PASSWORD
app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ 
            email, 
            resetToken: otp, 
            resetTokenExpiry: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// E. CLIENT DASHBOARD DATA
app.get('/api/client-dashboard/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const projects = await Project.find({ client: user._id });
        res.json({ user: user, projects: projects });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// F. ADMIN & EMPLOYEE DASHBOARDS
app.get('/api/admin/projects', async (req, res) => {
    const projects = await Project.find().populate('client', 'name email phone');
    res.json(projects);
});

app.get('/api/employee/projects', async (req, res) => {
    const projects = await Project.find({ status: { $ne: 'Completed' } }).populate('client', 'name email');
    res.json(projects);
});

// G. SERVICE LIBRARY (TEMPLATES)
app.get('/api/services-library', async (req, res) => {
    const services = await ServiceTemplate.find();
    res.json(services);
});

app.post('/api/services-library', async (req, res) => {
    const newService = new ServiceTemplate(req.body);
    await newService.save();
    res.json(newService);
});

// H. IMPORT TASKS TO PROJECT
app.post('/api/projects/:id/import-tasks', async (req, res) => {
    try {
        const { tasks } = req.body;
        await Project.findByIdAndUpdate(req.params.id, { tasks: tasks });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// I. GET EMPLOYEES (For Assignment)
app.get('/api/employees', async (req, res) => {
    const employees = await User.find({ role: { $ne: 'client' } }); 
    res.json(employees);
});

// J. FILE UPLOAD ENDPOINT
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        // Return the file path so frontend can save it
        res.json({ 
            success: true, 
            filePath: `/uploads/${req.file.filename}`,
            fileName: req.file.originalname 
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});