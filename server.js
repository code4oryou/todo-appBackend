const express = require('express');
const app = express();
const PORT = 5000;

// Test route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// In-memory array to store tasks (temporary for now)
let tasks = [];

// Route to add a new task
app.post('/tasks', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ message: 'Task is required' });
    }
    const newTask = {
        id: tasks.length + 1,
        task,
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Route to get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Route to update a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;

    const taskToUpdate = tasks.find((t) => t.id === parseInt(id));
    if (!taskToUpdate) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (task) taskToUpdate.task = task;
    if (typeof completed === 'boolean') taskToUpdate.completed = completed;

    res.json(taskToUpdate);
});

// Route to delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex((t) => t.id === parseInt(id));

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send(); // No content to return
});

// Middleware to parse JSON data
app.use(express.json());
