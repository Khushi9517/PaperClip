const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTasks);                    // GET /api/tasks
router.post('/', protect, createTask);                 // POST /api/tasks
router.put('/:id', protect, updateTask);               // PUT /api/tasks/:id
router.delete('/:id', protect, deleteTask);            // DELETE /api/tasks/:id
router.patch('/:id/toggle', protect, toggleTask);      // PATCH /api/tasks/:id/toggle

module.exports = router;