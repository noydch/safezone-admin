import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { message } from 'antd';

// ✅ ใช้ Environment Variable สำหรับ URL ของ backend
// ตัวอย่างสำหรับ Vite: import.meta.env.VITE_BACKEND_URL
// ตัวอย่างสำหรับ Create React App: process.env.REACT_APP_BACKEND_URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050'; // กำหนด fallback สำหรับ local development

const socket = io(BACKEND_URL);

const NotificationListener = () => {
    useEffect(() => {
        socket.on('orderItemCancelled', (data) => {
            console.log('📡 Real-time Event:', data);
            message.warning(
                `ອໍເດີ #${data.orderId} (ລາຍການ #${data.orderDetailId} - ${data.itemName}) ຖືກຍົກເລີກ: ${data.reason || 'ບໍ່ໄດ້ລະບຸ!'}`
            );
        });

        socket.on('connect_error', (err) => {
            console.error('Socket.IO Connection Error:', err.message);
            // Optional: message.error('Cannot connect to notification server.');
        });

        return () => {
            socket.off('orderItemCancelled');
            socket.off('connect_error');
        };
    }, []);

    return null;
};

export default NotificationListener;
