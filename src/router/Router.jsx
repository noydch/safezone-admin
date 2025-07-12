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

import SupplierMain from "../pages/supplier/SupplierMain";
import BuyDetail from "../components/import/BuyDetail";
import OrderDetail from "../components/order/OrderDetail";
import OrderMain from "../pages/order/OrderMain";
import ImportDetail from "../components/import/ImportDetail";
import ErrorPage from "../components/error/ErrorPage";
import Unit from "../components/unit/Unit";
import ProductUnit from "../components/unitProduct/ProductUnit";
import FrmEditUnit from "../components/unit/FrmEditUnit";

const router = createBrowserRouter([
    // auth
    {
        path: '/register',
        element: <Register />,
        // errorElement: <ErrorPage />
    },
    {
        path: '/login',
        element: <Login />,
        // errorElement: <ErrorPage />
    },
    // sale
    {
        path: '/',
        element: <ProtectedRoute><SaleMain /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },
    // order
    {
        path: '/orders',
        element: <ProtectedRoute><OrderMain /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },
    {
        path: '/order/orderDetail/:id',
        element: <ProtectedRoute><OrderDetail /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },

    // dashboard
    {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },

    // category
    {
        path: '/category',
        element: <ProtectedRoute><CategoryMain /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },
    {
        path: '/category/:id',
        element: <FrmEditCategory />,
        // errorElement: <ErrorPage />
    },

    // product
    {
        path: '/product',
        element: <ProtectedRoute><ProductMain /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },
    // product
    {
        path: '/add-unit',
        element: <ProtectedRoute><Unit /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },
    {
        path: '/edit-unit/:id',
        element: <ProtectedRoute><FrmEditUnit /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },
    {
        path: '/productUnit',
        element: <ProtectedRoute><ProductUnit /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },
    {
        path: '/booking',
        element: <ProtectedRoute> <BookingMain /> </ProtectedRoute>,
        // errorElement: <ErrorPage />
    },

    // Table
    {
        path: "/table",
        element: <ProtectedRoute><TableMain /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },

    // import buy
    {
        path: "/import-buy",
        element: <ProtectedRoute> <ImportAndBuyMain /> </ProtectedRoute>,
        // errorElement: <ErrorPage />
    },
    {
        path: "/importDetail/:id",
        element: <ProtectedRoute> <ImportDetail /> </ProtectedRoute>,
        // errorElement: <ErrorPage />
    },

    // buy detail
    {
        path: "/buy-detail/:id",
        element: <ProtectedRoute> <BuyDetail /> </ProtectedRoute>,
        // errorElement: <ErrorPage />
    },

    // user list
    {
        path: "/employee",
        element: <ProtectedRoute><UserMain /></ProtectedRoute>,
        // errorElement: <ErrorPage />
    },

    // customer
    {
        path: '/customer',
        element: <ProtectedRoute> <CustomerMain /> </ProtectedRoute>,
        // errorElement: <ErrorPage />
    },

    // supplier
    {
        path: '/supplier',
        element: <ProtectedRoute> <SupplierMain /> </ProtectedRoute>,
        // errorElement: <ErrorPage />
    },

    // report
    {
        path: '/reports',
        element: <ProtectedRoute> <ReportMain /> </ProtectedRoute>,
        // errorElement: <ErrorPage />
    }
])

const AppRoutes = () => {
    return <RouterProvider router={router} />
}
export default AppRoutes;