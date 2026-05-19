import axios from "axios";

const API =
  import.meta.env
    .VITE_BACKEND_URL;

// Token
const getToken =
  () =>
    localStorage.getItem(
      "token"
    );

// Auth Header
const authHeader =
  () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

// CREATE TASK
export const createTask =
  async (
    taskData
  ) => {
    const response =
      await axios.post(
        `${API}/api/tasks`,
        taskData,
        authHeader()
      );

    return response.data;
  };

// GET TASKS WITH FILTERS
export const getTasks =
  async (
    filters = {}
  ) => {
    const params =
      new URLSearchParams();

    if (
      filters.search
    ) {
      params.append(
        "search",
        filters.search
      );
    }

    if (
      filters.priority
    ) {
      params.append(
        "priority",
        filters.priority
      );
    }

    if (
      filters.status
    ) {
      params.append(
        "status",
        filters.status
      );
    }

    const response =
      await axios.get(
        `${API}/api/tasks?${params.toString()}`,
        authHeader()
      );

    return response.data;
  };

// UPDATE STATUS
export const updateTaskStatus =
  async (
    taskId,
    status
  ) => {
    const response =
      await axios.patch(
        `${API}/api/tasks/${taskId}/status`,
        { status },
        authHeader()
      );

    return response.data;
  };

// EDIT TASK
export const editTask =
  async (
    taskId,
    taskData
  ) => {
    const response =
      await axios.patch(
        `${API}/api/tasks/${taskId}`,
        taskData,
        authHeader()
      );

    return response.data;
  };

// DELETE TASK
export const deleteTask =
  async (
    taskId
  ) => {
    const response =
      await axios.delete(
        `${API}/api/tasks/${taskId}`,
        authHeader()
      );

    return response.data;
  };