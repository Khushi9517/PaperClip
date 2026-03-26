// 1. Import the Note model
const Note = require('../models/Note');

// 2. GET all notes for logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. GET a single note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. CREATE a new note
const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validate that title exists
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      tags: tags || [],
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 5. UPDATE a note
const updateNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;

    // Find note that belongs to this user
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update only the fields that were sent
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 6. DELETE a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 7. SEARCH notes by title or content
const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const notes = await Note.find({
      user: req.user._id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 8. Export all controllers
module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
};