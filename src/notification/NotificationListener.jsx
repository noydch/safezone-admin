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
                `ລາຍການໃນອໍເດີ #${data.orderDetailId} ຖືກຍົກເລີກ: ${data.reason || 'ไม่ระบุเหตุผล'}`
            );
        });

        return () => {
            socket.off('orderItemCancelled');
        };
    }, []);

    return null;
};

export default NotificationListener;
