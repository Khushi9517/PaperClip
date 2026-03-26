const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#b5a48b',
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);
module.exports = CalendarEvent;