import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "../pages/dashborad/Dashboard";
import CategoryMain from "../pages/category/CategoryMain";
import FrmEditCategory from "../components/category/FrmEditCategory";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />
    },
    {
        path: '/category',
        element: <CategoryMain />,
    },
    {
        path: '/category/:id',
        element: <FrmEditCategory />
    }
])

const AppRoutes = () => {
    return <RouterProvider router={router} />
}
export default AppRoutes;