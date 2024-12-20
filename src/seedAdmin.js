const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin'); 

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/constitutionalConnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("MongoDB connected...");
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'sujitacbe2018@gmail.com' });

    if (existingAdmin) {
        console.log("Admin already exists!");
        return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Sujita@04', 10);

    // Create new admin
    const newAdmin = new Admin({
        email: 'sujitacbe2018@gmail.com',
        password: hashedPassword,
    });

    // Save the admin to the database
    await newAdmin.save();
    console.log("Admin seeded successfully!");
    mongoose.disconnect();
}).catch(err => {
    console.error('Error:', err);
});
