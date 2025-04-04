import React from 'react';
import { Button, Modal, message } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath';

const DeleteCustomer = ({ customerId, customerName, onCustomerDeleted }) => {

    const handleDeleteClick = () => {
        Modal.confirm({
            title: 'ຢືນຢັນການລຶບ',
            // Use the provided customerName in the confirmation message
            content: `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລູກຄ້າ ${customerName}? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.`,
            okText: 'ລຶບ',
            okType: 'danger',
            cancelText: 'ຍົກເລີກ',
            onOk: async () => {
                try {
                    console.log(`Attempting to delete customer with ID: ${customerId}`);
                    await axios.delete(`${ApiPath.deleteCustomer}/${customerId}`);
                    message.success(`ລຶບລູກຄ້າ ${customerName} ສຳເລັດ!`);
                    // Call the callback function passed from the parent to refresh data
                    if (onCustomerDeleted) {
                        onCustomerDeleted();
                    }
                } catch (deleteError) {
                    console.error("Error deleting customer:", deleteError.response?.data || deleteError.message);
                    let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການລຶບລູກຄ້າ';
                    if (deleteError.response?.status === 404) {
                        errorMessage = 'ບໍ່ພົບຂໍ້ມູນລູກຄ້າທີ່ຈະລຶບ';
                    }
                    // Add checks for other potential errors, e.g., foreign key constraints
                    message.error(errorMessage);
                }
            },
        });
    };

    return (
        <Button type="primary" danger onClick={handleDeleteClick}>
            ລຶບ
        </Button>
    );
};

export default DeleteCustomer; 