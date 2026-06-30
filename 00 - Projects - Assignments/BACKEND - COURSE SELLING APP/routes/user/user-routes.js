const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel, CourseModel } = require('../../db/db');
const app = express();
const {auth} = require('../auth');
const saltRounds = 10;

require('dotenv').config();
router.use(express.json());



// POST   /signup
router.post('/signup', async (req, res) => {

    try {

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const arr = [];
        const admin = false;

        const existingUser = await UserModel.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(403).json({
                msg: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, saltRounds);

        await UserModel.create({
            username: username,
            email: email,
            password: hash,
            admin: admin,
            courses: arr
        });

        res.status(200).json({
            msg: "Sign Up Successful"
        });

    } catch (err) {

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }
});

// POST   /signin
router.post('/signin', async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findOne({
            email: email
        });

        if (!user) {
            return res.status(403).json({
                msg: "Sign Up First"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(403).json({
                msg: "Incorrect Password"
            });
        }

        const token = jwt.sign({
            username: user.username
        }, process.env.JWT_SECRET);

        res.status(200).json({
            msg: "Sign In Successful",
            token: token
        });

    } catch (err) {

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

});

// GET    /courses
router.get('/courses', auth, async (req, res) => {

    try {

        const courses = await CourseModel.find();

        res.status(200).json({
            courses
        });

    } catch (err) {

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

});

// GET    /course/:id
router.get('/course/:id', auth, async (req, res) => {

    try {

        const courseId = req.params.id;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({
                msg: "Course not found"
            });
        }

        res.status(200).json({
            course
        });

    } catch (err) {

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

});

// POST   /purchase-course/:id
router.post('/purchase-course/:id', auth, async (req, res) => {

    try {

        const courseId = req.params.id;
        const title = req.body.title;
        const body = req.body.body;
        const username = req.username;

        const user = await UserModel.findOne({
            username: username
        });

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        const userId = user._id;

        await UserModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                    courses: courseId
                }
            }
        );

        await CourseModel.create({
            userId: userId,
            title: title,
            body: body,
        });

        res.status(200).json({
            msg: "Course Purchase was Successful"
        });

    } catch (err) {

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

});

// GET    /my-courses
router.get('/my-courses', auth, async (req, res) => {

    try {

        const username = req.username;

        const user = await UserModel.findOne({
            username: username
        });

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        const courses = user.courses;

        res.status(200).json({
            courses
        });

    } catch (err) {

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

});

module.exports = router;