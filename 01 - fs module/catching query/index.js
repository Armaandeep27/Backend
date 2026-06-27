const express = require('express');
const app = express();
const fs = require('fs');

app.get('/:fileName', (req, res) => {
    const path = req.params.fileName;
    console.log(path);

    if (path === "/favicon.ico") return;

    let data;

    try {
        data = fs.readFileSync(path, 'utf8');
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(404).send("BAD REQUEST");
    }

    res.status(200).send(data);
})

app.listen(3000);