import { message } from "antd"
import { LoginApi } from "../api/auth"
import { createJSONStorage, persist } from "zustand/middleware"
import { create } from "zustand"
import { getCategoryApi } from "../api/category"
import { getDrinkApi, getFoodApi } from "../api/product"
import { getTableApi } from "../api/table"
import { getProductUnitsByDrinkIdApi } from "../api/productUnit"
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
    // productUnits: {}, // ไม่จำเป็นต้องมี state นี้ใน store อีกต่อไป ถ้าจะเก็บ productUnits ในแต่ละ item ของ carts

    // เพิ่มสินค้าในตะกร้า (แบบ Local)
    actionAddToCart: (item) => {
        set((state) => {
            const currentCarts = state.carts;
            // สำหรับเครื่องดื่ม, การเพิ่มจะต้องพิจารณา selectedUnitId ด้วย เพื่อไม่ให้ซ้ำกันคนละหน่วย
            const existingItem = currentCarts.find(cartItem =>
                cartItem.id === item.id &&
                cartItem.type === item.type &&
                (item.type === 'drink' ? cartItem.selectedUnitId === item.selectedUnitId : true)
            );

            if (existingItem) {
                // ถ้ามีสินค้าอยู่แล้ว (ทั้ง ID, Type และ Unit ถ้าเป็นเครื่องดื่ม) เพิ่มจำนวน
                const updatedCarts = currentCarts.map(cartItem =>
                    cartItem.id === item.id &&
                        cartItem.type === item.type &&
                        (item.type === 'drink' ? cartItem.selectedUnitId === item.selectedUnitId : true)
                        ? { ...cartItem, qty: cartItem.qty + 1 }
                        : cartItem
                );
                message.success("ເພີ່ມສິນຄ້າລົງກະຕ່າສຳເລັດ!!!");
                return { carts: updatedCarts };
            } else {
                // ถ้ายังไม่มีสินค้า เพิ่มใหม่ (item ที่ส่งมาควรมี productUnits และ selectedUnitId อยู่แล้วถ้าเป็นเครื่องดื่ม)
                message.success("ເພີ່ມສິນຄ້າລົງກະຕ່າສຳເລັດ!!!");
                return { carts: [...currentCarts, { ...item, qty: 1 }] }; // เพิ่ม item พร้อมจำนวนเริ่มต้น 1
            }
        });
    },

    // อัพเดทจำนวนสินค้าในตะกร้า (และเปลี่ยนหน่วยขายสำหรับเครื่องดื่ม)
    actionUpdateCart: (itemId, type, name, qty, selectedUnitId = null, price = null, productUnits = []) => {
        set((state) => {
            let currentCarts = [...state.carts]; // สร้าง copy ของ carts เพื่อให้สามารถแก้ไขได้
            let updated = false;

            if (type === 'drink') {
                if (selectedUnitId === null) {
                    message.warning('ກະລຸນาເລືອກຫົວໜ່ວຍກ່ອນ');
                    return { carts: state.carts }; // ถ้าไม่มี selectedUnitId ให้คืนค่าเดิม
                }

                // หา item ที่เป็นเครื่องดื่ม ID เดียวกัน แต่อาจจะเป็นหน่วยเก่า
                const existingItemIndexWithOldUnit = currentCarts.findIndex(
                    cartItem => cartItem.id === itemId && cartItem.type === type && cartItem.selectedUnitId !== selectedUnitId
                );

                // หา item ที่เป็นเครื่องดื่ม ID เดียวกัน และเป็นหน่วยที่เลือก (selectedUnitId)
                const existingItemIndexWithNewUnit = currentCarts.findIndex(
                    cartItem => cartItem.id === itemId && cartItem.type === type && cartItem.selectedUnitId === selectedUnitId
                );

                if (existingItemIndexWithNewUnit !== -1) {
                    // Scenario 1: มี item นี้ในตะกร้าอยู่แล้วด้วยหน่วยที่เลือก (selectedUnitId เดิม) -> แค่อัปเดตจำนวน
                    currentCarts[existingItemIndexWithNewUnit] = { ...currentCarts[existingItemIndexWithNewUnit], qty: qty };
                    updated = true;
                } else {
                    // Scenario 2: ไม่มี item นี้ในตะกร้าด้วยหน่วยที่เลือก (selectedUnitId ใหม่) -> เปลี่ยนหน่วย
                    const newUnit = productUnits.find(u => u.id === selectedUnitId);
                    if (newUnit) {
                        // ลบ item ที่เป็นเครื่องดื่ม ID เดียวกันทั้งหมดออกจากตะกร้าก่อน
                        currentCarts = currentCarts.filter(cartItem => !(cartItem.id === itemId && cartItem.type === type));

                        // เพิ่ม item ใหม่ด้วยหน่วยที่เลือก
                        currentCarts.push({
                            id: itemId,
                            type: type,
                            name: newUnit.name, // ใช้ชื่อหน่วยใหม่
                            price: newUnit.price,
                            qty: qty, // จำนวนที่ส่งมา (ปกติจะเป็น 1 เมื่อเปลี่ยนหน่วย)
                            selectedUnitId: newUnit.id,
                            imageUrl: (existingItemIndexWithOldUnit !== -1 ? state.carts[existingItemIndexWithOldUnit]?.imageUrl : ''), // ใช้รูปภาพเดิมจาก item เก่าถ้ามี
                            productUnits: productUnits // *** สำคัญ: เก็บ productUnits ไว้กับ item ใหม่ ***
                        });
                        updated = true;
                    } else {
                        message.error("ບໍ່ພົບຂໍ້ມູນຫົວໜ່ວຍສໍາລັບການປ່ຽນແປງ.");
                    }
                }
            } else { // type เป็น 'food' (อาหาร)
                const existingFoodItemIndex = currentCarts.findIndex(cartItem => cartItem.id === itemId && cartItem.type === type);
                if (existingFoodItemIndex !== -1) {
                    currentCarts[existingFoodItemIndex] = { ...currentCarts[existingFoodItemIndex], qty: qty };
                    updated = true;
                }
            }

            if (updated) {
                message.success("ອັບເດດກະຕ່າສຳເລັດ!!!");
                return { carts: currentCarts };
            }
            return { carts: state.carts }; // คืนค่าเดิมถ้าไม่มีการอัปเดต
        });
    },

    // ลบสินค้าออกจากตะกร้า
    actionRemoveFromCart: (itemId, type, selectedUnitId) => {
        set((state) => {
            const currentCarts = state.carts;
            const updatedCarts = currentCarts.filter(item => {
                if (item.type === 'drink') {
                    // สำหรับเครื่องดื่ม ต้องเช็ค selectedUnitId ด้วย เพื่อลบรายการที่ถูกต้อง
                    return !(item.id === itemId &&
                        item.type === type &&
                        item.selectedUnitId === selectedUnitId);
                } else {
                    // สำหรับสินค้าประเภทอื่น เช็คแค่ id และ type
                    return !(item.id === itemId && item.type === type);
                }
            });
            message.success("ລົບສິນຄ້າອອກຈາກກະຕ່າສຳເລັດ");
            return { carts: updatedCarts };
        });
    },

    // ล้างตะกร้าสินค้า
    actionClearCart: () => {
        set({ carts: [] });
        message.info("ລະງັບກະຕ່າສຳເລັດ");
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


