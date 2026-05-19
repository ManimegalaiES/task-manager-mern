import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children
}) => {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser =
      localStorage.getItem(
        "user"
      );

    const storedToken =
      localStorage.getItem(
        "token"
      );

    if (
      storedUser &&
      storedToken
    ) {
      setUser(
        JSON.parse(storedUser)
      );

      setToken(
        storedToken
      );
    }

    setLoading(false);
  }, []);

  // Login
  const login = (
    userData,
    jwtToken
  ) => {
    localStorage.setItem(
      "user",
      JSON.stringify(
        userData
      )
    );

    localStorage.setItem(
      "token",
      jwtToken
    );

    setUser(userData);

    setToken(jwtToken);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );

    setUser(null);

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated:
          !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  () =>
    useContext(
      AuthContext
    );