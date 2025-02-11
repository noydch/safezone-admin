import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "../pages/dashborad/Dashboard";
import CategoryMain from "../pages/category/CategoryMain";
import FrmEditCategory from "../components/category/FrmEditCategory";
import ProductMain from "../pages/product/ProductMain";
import SaleMain from "../pages/manageSale/SaleMain";
import TableMain from "../pages/manageTable/TableMain";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/login";
import ProtectedRoute from "./ProtectedRoute";

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

    // dashboard
    {
        path: '/',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
    },

    // category
    {
        path: '/category',
        element: <CategoryMain />,
    },
    {
        path: '/category/:id',
        element: <FrmEditCategory />
    },

    // product
    {
        path: '/product',
        element: <ProductMain />
    },

    // sale
    {
        path: '/sale',
        element: <SaleMain />
    },

    // Table
    {
        path: "/table",
        element: <TableMain />
    }
])

const AppRoutes = () => {
    return <RouterProvider router={router} />
}
export default AppRoutes;