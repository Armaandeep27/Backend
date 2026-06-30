const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const { UserModel, CourseModel } = require('../../db/db')
const { auth, admin_auth_extra } = require('../auth');
const saltRounds = 10;

router.use(express.json());

// admin

// POST   /signup

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const arr = [];
    const admin = true;
    const hash = await bcrypt.hash(password, saltRounds);

    await UserModel.create({
        username: username,
        email: email,
        password: hash,
        admin: admin,
        courses: arr
    })

    res.status(200).json({
        msg: "Sign Up Successful"
    })
})

// POST   /signin

router.post('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email
    })

    if (!user) {
        return res.status(403).json({
            msg: "Sign Up First"
        })
    }
    
    const username = user.username;

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(403).json({
            msg: "Incorrect Password"
        });
    }

    const token = jwt.sign({
        username: username
    }, process.env.JWT_SECRET)

    res.status(200).json({
        msg: "Sign In Successful",
        token: token
    })
})

// POST   /create-course

router.post('/create-course', auth, admin_auth_extra, async (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const username = req.username;
    const userId = req.userId;

    await CourseModel.create({
        title: title,
        body: body,
        userId: userId
    })

    res.status(200).json({
        msg: "Course Created"
    })
})

// PUT    /course/:id           // Edit course

router.put('/course/:id', auth, admin_auth_extra, async (req, res) => {
    const courseId = req.params.id;
    const userId = req.userId;
    const newBody = req.body.body;

    const updatedCourse = await CourseModel.findOneAndUpdate(
        {
            userId: userId,
            _id: courseId
        },
        { $set: { body: newBody } },
        { returnDocument: "after" }
    )

    if (!updatedCourse) {
        return res.status(403).json({
            msg: "Either Course was not Created by you or it doesnt exists"
        })
    }

    res.status(200).json({
        msg: "Course Edited"
    })
})


// DELETE /course/:id           // Delete course

router.delete('/course/:id', auth, admin_auth_extra, async (req, res) => {
    const username = req.username;
    const courseId = req.params.id;
    const userId = req.userId;

    const deletedCourse = await CourseModel.findOneAndDelete({
        _id: courseId,
        userId: userId
    });

    if (!deletedCourse) {
        return res.status(403).json({
            msg: "Either course was not created by you or course doesn't exist"
        });
    }

    res.status(200).json({
        msg: "Course Deleted"
    })
})


// GET    /courses              // View all courses created by admin

router.get('/courses', auth, admin_auth_extra, async (req, res) => {
    try {
        const userId = req.userId;

        const courses = await CourseModel.find({
            userId: userId
        });

        res.status(200).json({
            courses
        });
    } catch (err) {
        res.status(500).json({
            msg: "Something went wrong"
        });
    }
});

module.exports = router;