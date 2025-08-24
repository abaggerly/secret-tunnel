import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  const [username, setUsername] = useState();

  const signUp = async (body) => {
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const tempToken = await res.json();
      setToken(tempToken.token);
      setLocation("TABLET");
    } catch (e) {
      console.log(e);
    }
  };

  const authenticate = async () => {
    try {
      const res = await fetch(
        "https://fsa-jwt-practice.herokuapp.com/authenticate",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const usernameFromToken = data.data.username;
      if (usernameFromToken === username) setLocation();
    } catch (e) {
      console.log(e);
    }
  };

  const value = {
    location,
    signUp,
    authenticate,
    setUsername,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}