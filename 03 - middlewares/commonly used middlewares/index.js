const express = require('express');
const app = express();

// parses the json body to be readable automatically before the body reaches the route
app.use(express.json());

app.post('/sum', (req, res) => {
    const a = Number(req.body.a);
    const b = Number(req.body.b);

    res.status(200).json({
        ans : String(a + b)
    })
})

app.listen(3000);