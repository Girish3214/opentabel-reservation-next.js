"use client";

import { createContext, useContext, useEffect, useState } from "react";
import getCookie from "../utils/getCookies";
import axios from "axios";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

interface State {
  loading: boolean;
  error: string | null;
  data: User | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

const AuthenticationContect = createContext<AuthState>({
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

function AuthContext({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({ data: null, error: null, loading: true });

    try {
      const jwt = getCookie("jwt");
      if (!jwt) {
        setAuthState({ data: null, error: null, loading: false });
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/auth/getUserDetails",
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
      setAuthState({ data: response.data, error: null, loading: false });
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();

    return () => {};
  }, []);

  return (
    <AuthenticationContect.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContect.Provider>
  );
}

const useGlobalContext = () => {
  return useContext(AuthenticationContect);
};
export { useGlobalContext, AuthContext };
