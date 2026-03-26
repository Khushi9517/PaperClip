const CalendarEvent = require('../models/CalendarEvent');

const getEvents = async (req, res) => {
  try {
    // Optional: filter by month and year from query
    // e.g. /api/calendar?month=12&year=2024
    const filter = { user: req.user._id };

    if (req.query.month && req.query.year) {
      const start = new Date(req.query.year, req.query.month - 1, 1);
      const end = new Date(req.query.year, req.query.month, 0);
      filter.date = { $gte: start, $lte: end };
    }

    const events = await CalendarEvent.find(filter)
      .populate('tasks')
      .sort({ date: 1, isPinned: -1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, date, color, tasks } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const event = await CalendarEvent.create({
      user: req.user._id,
      title,
      description,
      date: new Date(date),
      color: color || '#b5a48b',
      tasks: tasks || [],
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { title, description, date, isPinned, color, tasks } = req.body;

    const event = await CalendarEvent.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = new Date(date);
    if (isPinned !== undefined) event.isPinned = isPinned;
    if (color !== undefined) event.color = color;
    if (tasks !== undefined) event.tasks = tasks;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };