const fs = require('fs').promises;
const express = require('express');
const app = express();

app.use(express.json());

async function readData() {
    const data = await fs.readFile('data.json', 'utf8');
    return JSON.parse(data);
}

async function writeData(dataArr) {
    await fs.writeFile(
        'data.json',
        JSON.stringify(dataArr, null, 2),
        'utf8'
    );
}


app.get('/', async (req, res) => {
    try {
        const dataArr = await readData();
        res.send(dataArr);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error reading file");
    }
});


app.post('/', async (req, res) => {
    try {
        const dataArr = await readData();

        const id = dataArr.length > 0
            ? dataArr[dataArr.length - 1].id + 1
            : 1;

        dataArr.push({
            id,
            description: req.body.description
        });

        await writeData(dataArr);

        res.status(201).send("Task added");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error writing file");
    }
});


app.put('/', async (req, res) => {
    const { id, description } = req.body;

    try {
        const dataArr = await readData();

        const task = dataArr.find(todo => todo.id === id);

        if (!task) {
            return res.status(404).send("Task not found");
        }

        task.description = description;

        await writeData(dataArr);

        res.send("Task updated");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating file");
    }
});


app.delete('/', async (req, res) => {
    const { id } = req.body;

    try {
        let dataArr = await readData();

        dataArr = dataArr.filter(todo => todo.id !== id);

        await writeData(dataArr);

        res.send("Task removed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting task");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});