import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isTokenExpired = () => {
        const token = localStorage.getItem("token");
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    };

    const isAuthenticated = localStorage.getItem("token") && !isTokenExpired();

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;