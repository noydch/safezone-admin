import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert } from 'antd';
import Sidebar from '../sidebar/Sidebar';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getOrderByIdApi } from '../../api/order';
import useSafezoneStore from '../../store/safezoneStore';
import { IoIosArrowBack } from 'react-icons/io';

const columns = [
    {
        title: 'ລາຍການ',
        dataIndex: 'item',
        key: 'item',
        render: (_, record) => {
            if (record.food) {
                return record.food.name || `ໄອດີອາຫານ: ${record.foodId}`;
            } else if (record.drink) {
                return record.drink.name || `ໄອດີເຄື່ອງດື່ມ: ${record.drinkId}`;
            }
            return 'N/A';
        },
    },
    {
        title: 'ຈຳນວນ',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'ລາຄາ',
        dataIndex: 'price',
        key: 'price',
        render: (price) => `${price.toLocaleString()} ກີບ`,
    },
    {
        title: 'ລາຄາລວມ',
        key: 'totalPrice',
        render: (_, record) => {
            const totalPrice = record.quantity * record.price;
            return `${totalPrice.toLocaleString()} ກີບ`;
        }
    },
];

const OrderDetail = () => {
    const { id } = useParams();
    const token = useSafezoneStore((state) => state.token);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nagivate = useNavigate()

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!token || !id) {
                setError("ຕ້ອງການ Token ແລະ Order ID.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const response = await getOrderByIdApi(token, id);

                console.log("API Response for Order Details:", response.data);

                if (response.data && typeof response.data === 'object' && Array.isArray(response.data.orderDetails)) {
                    console.log("Setting order details from response.data.orderDetails");
                    setOrderDetails(response.data.orderDetails);
                } else {
                    console.error("Data received does not contain a valid 'orderDetails' array:", response.data);
                    setError("ຮູບແບບຂໍ້ມູນລາຍລະອຽດຄຳສັ່ງຊື້ບໍ່ຖືກຕ້ອງ.");
                    setOrderDetails([]);
                }
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError(err.response?.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍລະອຽດຄຳສັ່ງຊື້.");
                setOrderDetails([]);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchOrderDetails();
        } else {
            setError("ກຳລັງລໍຖ້າ Authentication Token...");
            setLoading(false);
        }
    }, [id, token]);

    return (
        <Sidebar>
            <p
                onClick={() => nagivate(-1)}
                className=' flex items-center gap-x-2 font-medium mb-4 cursor-pointer hover:text-red-500 w-fit'><IoIosArrowBack /> ກັບຄືນ</p>
            <h2>ລາຍລະອຽດຄຳສັ່ງຊື້ #{id}</h2>
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : (
                <Table
                    columns={columns}
                    dataSource={orderDetails}
                    rowKey="id"
                    bordered
                />
            )}
        </Sidebar>
    );
}

export default OrderDetail;