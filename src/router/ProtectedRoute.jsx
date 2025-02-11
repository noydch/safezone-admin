import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("token"); // ตรวจสอบ Token ใน LocalStorage

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
