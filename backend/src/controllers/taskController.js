const Task = require(
  "../models/Task"
);

// CREATE TASK
const createTask =
  async (req, res) => {
    try {
      const {
        title,
        description,
        priority,
        dueDate
      } = req.body;

      if (!title) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Title is required"
          });
      }

      const task =
        await Task.create({
          title,
          description,
          priority,
          dueDate,
          user:
            req.user._id
        });

      res.status(201).json({
        success: true,
        message:
          "Task created successfully",
        task
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to create task"
      });
    }
  };

// GET TASKS WITH SEARCH + FILTER
const getTasks =
  async (req, res) => {
    try {
      const {
        search,
        priority,
        status
      } = req.query;

      let query = {
        user:
          req.user._id
      };

      // Search
      if (search) {
        query.title = {
          $regex: search,
          $options: "i"
        };
      }

      // Priority Filter
      if (
        priority &&
        priority !== "All"
      ) {
        query.priority =
          priority;
      }

      // Status Filter
      if (
        status &&
        status !== "All"
      ) {
        query.status =
          status;
      }

      const tasks =
        await Task.find(
          query
        ).sort({
          createdAt: -1
        });

      res.status(200).json({
        success: true,
        count:
          tasks.length,
        tasks
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch tasks"
      });
    }
  };

// UPDATE TASK STATUS
const updateTaskStatus =
  async (req, res) => {
    try {
      const {
        status
      } = req.body;

      const allowedStatus =
        [
          "Planned",
          "In Progress",
          "Complete"
        ];

      if (
        !allowedStatus.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid status"
          });
      }

      const task =
        await Task.findOne(
          {
            _id:
              req.params.id,
            user:
              req.user
                ._id
          }
        );

      if (!task) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Task not found"
          });
      }

      task.status =
        status;

      await task.save();

      res.status(200).json({
        success: true,
        message:
          "Task status updated",
        task
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update status"
      });
    }
  };

// EDIT TASK
const editTask =
  async (req, res) => {
    try {
      const {
        title,
        description,
        priority,
        dueDate
      } = req.body;

      const task =
        await Task.findOne(
          {
            _id:
              req.params.id,
            user:
              req.user
                ._id
          }
        );

      if (!task) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Task not found"
          });
      }

      task.title =
        title ||
        task.title;

      task.description =
        description ??
        task.description;

      task.priority =
        priority ||
        task.priority;

      task.dueDate =
        dueDate ||
        task.dueDate;

      await task.save();

      res.status(200).json({
        success: true,
        message:
          "Task updated successfully",
        task
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to edit task"
      });
    }
  };

// DELETE TASK
const deleteTask =
  async (req, res) => {
    try {
      const task =
        await Task.findOne(
          {
            _id:
              req.params.id,
            user:
              req.user
                ._id
          }
        );

      if (!task) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Task not found"
          });
      }

      await task.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Task deleted successfully"
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete task"
      });
    }
  };

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  editTask,
  deleteTask
};