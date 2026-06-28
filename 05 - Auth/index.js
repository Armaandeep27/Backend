const express = require('express');
const JWT_SECRET = "random"; // will go in env later just lazy
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let users = [];

// basic auth using randomly generated token when user is signed in so he doesnt need to login over and over

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return res.status(404).json({
                msg: "username already exists"
            })
        }
    }

    users.push({
        username: username,
        password: password
    })

    return res.status(404).json({
        msg: "User Created",
    })
})

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {

            const token = jwt.sign({
                username: username
            }, JWT_SECRET);


            return res.status(200).json({
                msg: "Logged In",
                token: token
            })
        }
    }

    return res.status(200).json({
        msg: "Username Or Password is Wrong"
    })

})

app.get('/me', (req, res) => {
    const token = req.headers.token
    console.log("Token:", token);
    const decodedToken = jwt.verify(token, JWT_SECRET)
    const username = decodedToken.username;

    let user;

    user = users.find((user) => {
        return user.username === username;
    })

    if (!user) {
        return res.status(400).json({
            msg: "WRONG INFO"
        });
    }

    res.status(200).json({
        msg: "LOGGED IN",
        username: user.username
    })
})

app.listen(3000);