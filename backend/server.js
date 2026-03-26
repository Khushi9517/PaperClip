// 1. Import all the packages we installed
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 2. Load the .env file so we can use process.env.VARIABLE_NAME
dotenv.config();

// 3. Create the express app
const app = express();

// 4. Middlewares
app.use(cors());
app.use(express.json());

const taskRoutes = require('./routes/taskRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
app.use('/api/tasks', taskRoutes);
app.use('/api/calendar', calendarRoutes);

// Import routes
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);

// 5. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

  // 6. A test route to make sure server is working
app.get('/', (req, res) => {
  res.send('PaperClip Backend is Running 🚀');
});

// 7. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌍 Server running on port ${PORT}`);
});