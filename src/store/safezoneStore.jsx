import { message } from "antd"
import { LoginApi } from "../api/auth"
import { createJSONStorage, persist } from "zustand/middleware"
import { create } from "zustand"
import { getCategoryApi } from "../api/category"
import { getDrinkApi, getFoodApi } from "../api/product"
import { getTableApi } from "../api/table"
import { addCartApi } from "../api/cart"
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

    // เพิ่มสินค้าในตะกร้า
    actionAddToCart: async (token, cart) => {
        try {
            const response = await addCartApi(token, cart);
            if (response?.data) {
                message.success("Add to cart successfully");

                // ดึงข้อมูลตะกร้าล่าสุด
                const cartResponse = await axios.get(ApiPath.getCart, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (cartResponse?.data) {
                    set({ carts: cartResponse.data.cart }); // อัปเดตตะกร้าให้ตรงกับเซิร์ฟเวอร์
                }
            }
        } catch (error) {
            console.log("Error adding to cart:", error);
        }
    },
    listCart: async (token) => {
        try {
            const response = await axios.get(ApiPath.getCart, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response?.data) {
                set({ carts: response.data.cart });
            }
        } catch (error) {
            console.log("Error fetching cart:", error);
        }
    },

    actionUpdateCart: async (token, { cartItemId, qty }) => {
        try {
            await axios.put(ApiPath.updateCart, { cartItemId, qty }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // โหลดข้อมูลตะกร้าล่าสุด
            await get().listCart(token);
            console.log("Cart updated successfully");
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    },
    actionRemoveFromCart: async (token, cartItemId) => {
        try {
            await axios.delete(`${ApiPath.removeCart}/${cartItemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // โหลดข้อมูลตะกร้าล่าสุด
            await get().listCart(token);
            message.success("Item removed from cart");
        } catch (error) {
            message.error("Failed to remove item");
        }
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
