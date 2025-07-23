import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { message } from 'antd';

// ✅ เปลี่ยนเป็น URL ของ backend จริงตอน deploy
const socket = io('http://localhost:5050');

const NotificationListener = () => {
    useEffect(() => {
        socket.on('orderItemCancelled', (data) => {
            console.log('📡 Real-time Event:', data);
            message.warning(
                // เปลี่ยนข้อความให้แสดง Order ID หลักและชื่ออาหาร/เครื่องดื่ม
                `ອໍເດີ #${data.orderId} (ລາຍການ #${data.orderDetailId} - ${data.itemName}) ຖືກຍົກເລີກ: ${data.reason || 'ไม่ระบุเหตุผล'}`
            );
        });

        return () => {
            socket.off('orderItemCancelled');
        };
    }, []);

    return null;
};

export default NotificationListener;
