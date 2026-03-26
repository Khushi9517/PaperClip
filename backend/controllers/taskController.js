const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    // Optional filter by completion status from URL query
    // e.g. /api/tasks?completed=true
    const filter = { user: req.user._id };

    if (req.query.completed !== undefined) {
      filter.isCompleted = req.query.completed === 'true';
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const tasks = await Task.find(filter)
      .sort({ isCompleted: 1, dueDate: 1, createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate: dueDate || null,
      priority: priority || 'medium',
      tags: tags || [],
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, isCompleted, dueDate, priority, tags } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (tags !== undefined) task.tags = tags;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Flip the boolean — if true becomes false, if false becomes true
    task.isCompleted = !task.isCompleted;
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export all
module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
};