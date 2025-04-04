import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "../pages/dashborad/Dashboard";
import CategoryMain from "../pages/category/CategoryMain";
import FrmEditCategory from "../components/category/FrmEditCategory";
import ProductMain from "../pages/product/ProductMain";
import SaleMain from "../pages/sale/SaleMain";
import TableMain from "../pages/manageTable/TableMain";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import BookingMain from "../pages/booking/BookingMain";
import ImportAndBuyMain from "../pages/import/ImportAndBuyMain";
import UserMain from "../pages/user/UserMain";
import ReportMain from "../pages/reports/ReportMain";
import CustomerMain from "../pages/customer/CustomerMain";

const router = createBrowserRouter([
    // auth
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    },
    // sale
    {
        path: '/',
        element: <ProtectedRoute><SaleMain /></ProtectedRoute>
    },

    // dashboard
    {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
    },

    // category
    {
        path: '/category',
        element: <ProtectedRoute><CategoryMain /></ProtectedRoute>,
    },
    {
        path: '/category/:id',
        element: <FrmEditCategory />
    },

    // product
    {
        path: '/product',
        element: <ProtectedRoute><ProductMain /></ProtectedRoute>
    },
    {
        path: '/booking',
        element: <ProtectedRoute> <BookingMain /> </ProtectedRoute>
    },

    // Table
    {
        path: "/table",
        element: <ProtectedRoute><TableMain /></ProtectedRoute>
    },

    // import buy
    {
        path: "/import-buy",
        element: <ProtectedRoute> <ImportAndBuyMain /> </ProtectedRoute>
    },

    // user list
    {
        path: "/employee",
        element: <ProtectedRoute><UserMain /></ProtectedRoute>
    },

    // customer
    {
        path: '/customer',
        element: <ProtectedRoute> <CustomerMain /> </ProtectedRoute>
    },

    // report
    {
        path: '/reports',
        element: <ProtectedRoute> <ReportMain /> </ProtectedRoute>
    }
])

const AppRoutes = () => {
    return <RouterProvider router={router} />
}
export default AppRoutes;