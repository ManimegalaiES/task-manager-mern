const express =
  require("express");

const router =
  express.Router();

const protect =
  require(
    "../middleware/authMiddleware"
  );

const {
  createTask,
  getTasks,
  updateTaskStatus,
  editTask,
  deleteTask
} = require(
  "../controllers/taskController"
);

// Create Task
router.post(
  "/",
  protect,
  createTask
);

// Get Tasks
router.get(
  "/",
  protect,
  getTasks
);

// Update Task Status
router.patch(
  "/:id/status",
  protect,
  updateTaskStatus
);

// Edit Task
router.patch(
  "/:id",
  protect,
  editTask
);

// Delete Task
router.delete(
  "/:id",
  protect,
  deleteTask
);

module.exports =
  router;