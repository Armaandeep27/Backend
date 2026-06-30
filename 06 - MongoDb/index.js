const express = require('express');
const app = express();
const { UserModel, TodoModel } = require('./db');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config()
app.use(express.json());
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

app.post('/signup', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password;
    let hash = await bcrypt.hash(password, saltRounds)

    try {
        await UserModel.create({
            name: name,
            email: email,
            password: hash
        })
    }
    catch (err) {
        return res.status(403).json({
            err: err
        })
    }

    res.status(200).json({
        msg: "You are signed up"
    })
});

app.post('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email
    })

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(403).json({
            msg: "Wrong Credentials"
        })
    }
    else {
        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET);

        res.status(200).json({
            msg: "You are Signed in just reload the website",
            token: token
        })
    }
});


function auth(req, res, next) {
    const token = req.headers.token;
    const decodedToken = jwt.verify(token, JWT_SECRET);

    if (!decodedToken) {
        return res.status(404).json({
            msg: "Log In First"
        })
    }

    req.userId = decodedToken.id;
    next();
}

// authenticated this route is to post todos by the user
app.post('/todo', auth, async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const done = false;

    await TodoModel.create({
        userId: userId,
        title: title,
        done: done
    })

    res.status(200).json({
        msg: "Todo Added Successfully"
    })
});

// authenticated this route is used to view the todos user got
app.get('/todos', auth, async (req, res) => {
    const userId = req.userId;

    const data = await TodoModel.find({
        userId: userId
    })

    res.status(200).json({
        msg: "wait a sec",
        todos: JSON.stringify(data)
    })
});

app.listen(3000);
