const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEvents);              // GET /api/calendar
router.post('/', protect, createEvent);           // POST /api/calendar
router.put('/:id', protect, updateEvent);         // PUT /api/calendar/:id
router.delete('/:id', protect, deleteEvent);      // DELETE /api/calendar/:id

module.exports = router;