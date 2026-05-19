const express = require(
  "express"
);

const cors = require("cors");

const authRoutes = require(
  "./routes/authRoutes"
);

const taskRoutes = require(
  "./routes/taskRoutes"
);

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Task Manager API Running"
  );
});

// Auth Routes
app.use(
  "/api/auth",
  authRoutes
);

// Task Routes
app.use(
  "/api/tasks",
  taskRoutes
);

module.exports = app;