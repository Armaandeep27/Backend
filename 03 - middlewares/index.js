const express = require('express');
const fs = require('fs');
const app = express();

let request = 0;
let errors = 0;

async function readData() {
    const data = await fs.readFile('rate-limiting.json', 'utf8');
    return JSON.parse(data);
}

async function createUser(username) {
    const data = await readData();

    data.push({
        username: username,
        reqNo: 1
    });

    await fs.writeFile(
        'rate-limiting.json',
        JSON.stringify(data, null, 2)
    );
}

async function middleRateLimiting(req, res, next) {
    const username = req.query.username;
    const data = await readData();

    let reqNo = 0;

    for (let i = 0; i < data.length; i++) {
        if (username === data[i].username) {
            reqNo = data[i].reqNo;
            break;
        }
    }

    if (reqNo >= 10) {
        
        errors = errors+1;

        await fs.appendFile(
            "errors.txt",
            "\nNew Error Occurred, No of Errors: " + errors + ", by username " + username,
            { encoding: "utf8" }
        );

        return res.status(429).json({
            msg: "TOO MANY REQUESTS SIR PLEASE STOP!!"
        });
    }

    next();
}

async function middleLogging(req, res, next) {
    request++;

    try {
        await fs.appendFile(
            "logs.txt",
            "\nNew Request, No of Requests: " + request,
            { encoding: "utf8" }
        );

        console.log(
            await fs.readFile("logs.txt", "utf8")
        );

        const username = req.query.username;
        let found = false;
        const data = await readData();

        for (let i = 0; i < data.length; i++) {
            if (username === data[i].username) {
                data[i].reqNo++;
                found = true;
                break;
            }
        }

        if (!found) {
            await createUser(username);
        } else {
            await fs.writeFile(
                "rate-limiting.json",
                JSON.stringify(data, null, 2)
            );
        }

        next();

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
}

app.get('/', middleRateLimiting, middleLogging, (req, res) => {
    res.status(200).json({
        msg: "received"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});