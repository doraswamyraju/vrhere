// backend/create_users.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Connect to Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Connection Error:', err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String }, 
    phone: String,
    role: { type: String, default: 'client' }, // client, admin, employee
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

const createUsers = async () => {
    try {
        // --- ADMIN USER ---
        const adminPass = await bcrypt.hash("Admin@123", 10); // <--- CHANGE PASSWORD HERE
        const admin = new User({
            name: "Super Admin",
            email: "admin@vrhere.in",   // <--- CHANGE EMAIL HERE
            phone: "7997991101",
            password: adminPass,
            role: "admin"
        });

        // --- EMPLOYEE USER ---
        const empPass = await bcrypt.hash("Staff@123", 10);   // <--- CHANGE PASSWORD HERE
        const employee = new User({
            name: "Rahul Staff",
            email: "staff@vrhere.in",   // <--- CHANGE EMAIL HERE
            phone: "7997991101",
            password: empPass,
            role: "employee"
        });

        // Save to DB
        // Using 'upsert' logic: updates if exists, creates if new
        await User.findOneAndUpdate({ email: admin.email }, admin, { upsert: true });
        console.log(`✅ Admin User Created: ${admin.email}`);

        await User.findOneAndUpdate({ email: employee.email }, employee, { upsert: true });
        console.log(`✅ Employee User Created: ${employee.email}`);

    } catch (error) {
        console.error("❌ Error creating users:", error);
    } finally {
        mongoose.connection.close();
    }
};

createUsers();