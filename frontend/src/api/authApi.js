import axios from "axios";

const API =
  import.meta.env
    .VITE_BACKEND_URL;

// Google Login API
export const googleLogin =
  async (token) => {
    try {
      const response =
        await axios.post(
          `${API}/api/auth/google`,
          { token }
        );

      return response.data;
    } catch (error) {
      console.log(
        "Google Login Error:",
        error.response?.data
      );

      throw error;
    }
  };

// Get Current User
export const getCurrentUser =
  () => {
    const user =
      localStorage.getItem(
        "user"
      );

    return user
      ? JSON.parse(user)
      : null;
  };

// Logout
export const logoutUser =
  () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );
  };