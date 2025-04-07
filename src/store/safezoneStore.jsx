import { message } from "antd"
import { LoginApi } from "../api/auth"
import { createJSONStorage, persist } from "zustand/middleware"
import { create } from "zustand"
import { getCategoryApi } from "../api/category"
import { getDrinkApi, getFoodApi } from "../api/product"
import { getTableApi } from "../api/table"
// import { addCartApi, getCartApi } from "../api/cart"
import axios from "axios"
import ApiPath from "../api/apiPath"

const safezoneStore = (set, get) => ({
    user: null,
    token: null,
    categories: [],
    food: [],
    drink: [],
    carts: [],
    tables: [],

    // เพิ่มสินค้าในตะกร้า (แบบ Local)
    actionAddToCart: async (item) => {
        const currentCarts = get().carts;
        const existingItem = currentCarts.find(cartItem =>
            cartItem.id === item.id &&
            cartItem.type === item.type &&
            cartItem.name === item.name
        );

        if (existingItem) {
            // ถ้ามีสินค้าอยู่แล้ว เพิ่มจำนวน
            const updatedCarts = currentCarts.map(cartItem =>
                cartItem.id === item.id &&
                    cartItem.type === item.type &&
                    cartItem.name === item.name
                    ? { ...cartItem, qty: cartItem.qty + 1 }
                    : cartItem
            );
            set({ carts: updatedCarts });
        } else {
            // ถ้ายังไม่มีสินค้า เพิ่มใหม่
            set({ carts: [...currentCarts, { ...item, qty: 1 }] });
        }
        message.success("Add to cart successfully");
    },

    // อัพเดทจำนวนสินค้าในตะกร้า
    actionUpdateCart: (itemId, type, name, qty) => {
        const currentCarts = get().carts;
        const updatedCarts = currentCarts.map(item =>
            item.id === itemId &&
                item.type === type &&
                item.name === name
                ? { ...item, qty }
                : item
        );
        set({ carts: updatedCarts });
    },

    // ลบสินค้าออกจากตะกร้า
    actionRemoveFromCart: (itemId, type, name) => {
        const currentCarts = get().carts;
        const updatedCarts = currentCarts.filter(item =>
            !(item.id === itemId && item.type === type && item.name === name)
        );
        set({ carts: updatedCarts });
        message.success("Item removed from cart");
    },

    // ล้างตะกร้าสินค้า
    actionClearCart: () => {
        set({ carts: [] });
        message.info("Cart cleared");
    },

    // เข้าสู่ระบบ
    actionLogin: async (formData) => {
        try {
            const response = await LoginApi(formData.email, formData.password);
            if (response?.data) {
                set({
                    user: response.data.payload,
                    token: response.data.token
                });
            }
            return response;
        } catch (error) {
            console.log("Error logging in:", error);
        }
    },

    // ดึงข้อมูลประเภทสินค้า
    listCategory: async () => {
        try {
            const response = await getCategoryApi();
            if (response?.data) {
                set({ categories: response.data });
            }
        } catch (error) {
            console.log("Error fetching categories:", error);
        }
    },

    // ดึงข้อมูลอาหาร
    listFood: async () => {
        try {
            const response = await getFoodApi();
            if (response?.data) {
                set({ food: response.data });
            }
        } catch (error) {
            console.log("Error fetching food:", error);
        }
    },

    // ดึงข้อมูลเครื่องดื่ม
    listDrink: async () => {
        try {
            const response = await getDrinkApi();
            if (response?.data) {
                set({ drink: response.data });
            }
        } catch (error) {
            console.log("Error fetching drinks:", error);
        }
    },

    // ดึงข้อมูลโต๊ะ
    listTable: async () => {
        try {
            const response = await getTableApi();
            if (response?.data) {
                set({ tables: response.data });
            }
        } catch (error) {
            console.log("Error fetching tables:", error);
        }
    }
});

const usePersist = {
    name: "safezone-store",
    storage: createJSONStorage(() => localStorage)
};

const useSafezoneStore = create(persist(safezoneStore, usePersist));

export default useSafezoneStore;
