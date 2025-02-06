import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "../pages/dashborad/Dashboard";
import CategoryMain from "../pages/category/CategoryMain";
import FrmEditCategory from "../components/category/FrmEditCategory";
import ProductMain from "../pages/product/ProductMain";
import SaleMain from "../pages/manageSale/SaleMain";
import TableMain from "../pages/manageTable/TableMain";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />
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