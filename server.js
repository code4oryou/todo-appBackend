const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const cors = require('cors');

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(cors());
app.use(express.json());

// Define Mongoose Schema and Model for Task
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Route to add a new task
app.post('/tasks', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Task name is required' });
    }

    const newTask = new Task({ name }); // Create a new task instance
    await newTask.save(); // Save the task to the database

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find(); // Assuming 'Task' is your Mongoose model
        res.json(tasks.map(task => ({ id: task._id, name: task.name, completed: task.completed })));
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});


// Route to toggle task completion
app.put('/tasks/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id); // Find the task by ID in the database

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed; // Toggle the completed state
    await task.save(); // Save the updated task to the database

    res.json({ task });
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: 'Error toggling task' });
  }
});

// Route to delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id); // Delete the task from the database

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(204).send(); // No content to return
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
