import axios from "axios";

// Fetch tasks from the API
const API_URL = "http://localhost:8000/api";

// Get all tasks from the API
export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/Task`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// get task filter by status from the API
export const getTasksByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_URL}/Task`, {
      params: status ? { status } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
    throw error;
  }
};

// create a new task from the API
export const createTask = async (task) => {
  try {
    const response = await axios.post(`${API_URL}/Task`, task);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// update status of a task from the API
export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const response = await axios.put(`${API_URL}/Task/${taskId}/status`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

// update a task from the API
export const updateTask = async (taskId, updatedTask) => {
  try {
    const response = await axios.put(`${API_URL}/Task/${taskId}`, updatedTask);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// delete a task from the API
export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/Task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// autocomplete task description based on the title from the API
export const autoCompleteDescription = async (title) => {
  try {
    const response = await axios.post(`${API_URL}/Task/autoComplete`, {
      title,
    });
    return response.data;
  } catch (error) {
    console.error("Error auto-completing description:", error);
    throw error;
  }
};
