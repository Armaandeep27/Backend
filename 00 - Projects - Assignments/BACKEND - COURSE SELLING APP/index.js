const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { UserModel, CourseModel } = require('./db/db');
const userRoutes = require('./routes/user/user-routes');
const adminRoutes = require('./routes/admin/admin-routes');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Successfully Connected to DB")
    }
    catch (err) {
        console.log(err);
        return
    }
}

connectDB();

app.use(express.json());

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.listen(3000);

