const express = require('express');
const app = express();

app.get('/multiply', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.send(String(a * b));
});

app.get('/divide', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.send(String(a / b));
});

app.get('/addition', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.send(String(a + b));
});

app.get('/subtraction', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.send(String(a - b));
});

/*
    if the problem says that the inputs are in the query as /add/a/b

    then to get access to the variables we can use .get at "/add/:a/:b" route thereby inside the callback
    function we can just access the a and b in the query by writting "req.params.a"
*/

app.listen(3000, () => {
    console.log("Server running");
});