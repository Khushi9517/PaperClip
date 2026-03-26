const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

// All routes below are protected — user must be logged in

router.get('/search', protect, searchNotes);      // GET /api/notes/search?query=...
router.get('/', protect, getNotes);               // GET /api/notes
router.get('/:id', protect, getNoteById);         // GET /api/notes/:id
router.post('/', protect, createNote);            // POST /api/notes
router.put('/:id', protect, updateNote);          // PUT /api/notes/:id
router.delete('/:id', protect, deleteNote);       // DELETE /api/notes/:id

module.exports = router;