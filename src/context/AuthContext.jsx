import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // ข้อมูล user
    const [token, setToken] = useState(null); // JWT token
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const store = JSON.parse(localStorage.getItem("safezone-store"));
        if (store?.state?.user && store?.state?.token) {
            setUser(store.state.user);
            setToken(store.state.token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${store.state.token}`;
        }
        setLoading(false);
    }, []);



    const login = (payload, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(payload));  // แปลง payload เป็น JSON string ก่อนเก็บ
        setUser(payload);
        setToken(token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
