# 📎 PaperClip

> *Clip your thoughts, forever.*

A full-stack productivity app built with the MERN stack — featuring notes, daily tasks, and a calendar, wrapped in a warm vintage aesthetic.

![PaperClip](https://img.shields.io/badge/Stack-MERN-c9a84c?style=for-the-badge)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

---

## ✨ Features

- 🔐 **Authentication** — Secure signup & login with JWT tokens
- 📝 **Notes** — Create, edit, delete, pin, tag, and search notes
- ✅ **Tasks** — Daily to-dos with priority levels, due dates, and completion tracking
- 🗓️ **Calendar** — Monthly calendar with color-coded pinnable events
- 🌙 **Dark / Light Mode** — Vintage candlelight dark theme & aged paper light theme
- 🔍 **Search** — Full-text search across notes by title, content, and tags
- 🏷️ **Tags** — Organize notes and tasks with custom tags
- 📌 **Pin** — Pin important notes and calendar events to the top
- 📊 **Dashboard** — Overview of pinned notes, today's tasks, and upcoming events
- 📱 **Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| cors | Cross-origin requests |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| React Icons | Icon library |
| React Calendar | Calendar component |
| date-fns | Date formatting utilities |

---

## 📁 Project Structure

```
paperclip/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── noteController.js
│   │   ├── taskController.js
│   │   └── calendarController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   ├── Task.js
│   │   └── CalendarEvent.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── taskRoutes.js
│   │   └── calendarRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── calendar/
    │   │   ├── common/
    │   │   ├── layout/
    │   │   ├── notes/
    │   │   └── tasks/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Home.jsx
    │   │   ├── Notes.jsx
    │   │   ├── Tasks.jsx
    │   │   └── Calendar.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or a [MongoDB Atlas](https://mongodb.com/atlas) account
- [Git](https://git-scm.com)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/paperclip.git
cd paperclip
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/paperclip
JWT_SECRET=yourSuperSecretKeyHere
PORT=5000
```

Start the backend development server:

```bash
npm run dev
```

The backend will run at `http://localhost:5000`

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/signup       Register a new user
POST   /api/auth/login        Login and receive JWT token
```

### Notes
```
GET    /api/notes             Get all notes for logged-in user
GET    /api/notes/:id         Get a single note
GET    /api/notes/search      Search notes (?query=...)
POST   /api/notes             Create a new note
PUT    /api/notes/:id         Update a note
DELETE /api/notes/:id         Delete a note
```

### Tasks
```
GET    /api/tasks             Get all tasks (supports ?completed= & ?priority= filters)
POST   /api/tasks             Create a new task
PUT    /api/tasks/:id         Update a task
PATCH  /api/tasks/:id/toggle  Toggle task completion
DELETE /api/tasks/:id         Delete a task
```

### Calendar
```
GET    /api/calendar          Get events (supports ?month= & ?year= filters)
POST   /api/calendar          Create a new event
PUT    /api/calendar/:id      Update an event
DELETE /api/calendar/:id      Delete an event
```

> All routes except `/api/auth/signup` and `/api/auth/login` require a Bearer token in the Authorization header.

---

## 🌍 Deployment

### Backend — Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set the following:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

5. Add environment variables:
```
MONGO_URI    = your MongoDB Atlas connection string
JWT_SECRET   = your secret key
NODE_ENV     = production
PORT         = 5000
```

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set the following:

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. Add environment variable:
```
VITE_API_URL = https://your-render-backend-url.onrender.com/api
```

---

## 🎨 Design System

PaperClip uses a custom vintage design system built with CSS custom properties.

### Fonts
| Font | Usage |
|---|---|
| Playfair Display | Headings, titles, logo |
| Lora | Body text, paragraphs |
| Special Elite | Labels, tags, typewriter elements |

### Color Palette (Light Mode)
| Variable | Value | Usage |
|---|---|---|
| `--bg-primary` | `#f5f0e8` | Main background — aged paper |
| `--accent-primary` | `#8b6914` | Gold — primary actions |
| `--accent-success` | `#4a7c59` | Green — completed tasks |
| `--accent-danger` | `#8b2e2e` | Red — destructive actions |
| `--text-primary` | `#2c2416` | Main text — dark ink |

---

## 📸 Pages Overview

| Page | Description |
|---|---|
| **Login / Signup** | Vintage lined paper card with large background text |
| **Dashboard** | Welcome banner, stat cards, pinned notes, today's tasks, upcoming events |
| **Notes** | Masonry-style card grid with search, tag filter, pin, and modal editor |
| **Tasks** | Progress bar, priority filters, sortable task list with due date badges |
| **Calendar** | Monthly grid with event dots, side panel for selected day's events |

---

## 🔮 Planned Features

- [ ] File attachments on notes (Cloudinary)
- [ ] Email reminders for calendar events (Nodemailer)
- [ ] Export notes as PDF
- [ ] Shared notes between users
- [ ] AI-powered note summarization
- [ ] Google Calendar sync
- [ ] Progressive Web App (PWA) support

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Made with 📎 and lots of ☕

> *"A place for every thought, and every thought in its place."*
