import React from 'react';
import { Button, Modal, message } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // Adjust path if necessary

const DeleteSupplier = ({ supplierId, supplierName, onSupplierDeleted }) => {

    const handleDeleteClick = () => {
        Modal.confirm({
            title: 'ຢືນຢັນການລຶບ',
            content: `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຜູ້ສະໜອງ ${supplierName}? ກວດສອບໃຫ້ແນ່ໃຈວ່າບໍ່ມີລາຍການສັ່ງຊື້ ຫຼື ນຳເຂົ້າທີ່ຕິດພັນ.`,
            okText: 'ລຶບ',
            okType: 'danger',
            cancelText: 'ຍົກເລີກ',
            onOk: async () => {
                try {
                    console.log(`Attempting to delete supplier with ID: ${supplierId}`);
                    // Use deleteSupplier endpoint
                    await axios.delete(`${ApiPath.deleteSupplier}/${supplierId}`);
                    message.success(`ລຶບຜູ້ສະໜອງ ${supplierName} ສຳເລັດ!`);
                    if (onSupplierDeleted) {
                        onSupplierDeleted(); // Trigger refresh in parent
                    }
                } catch (deleteError) {
                    console.error("Error deleting supplier:", deleteError.response?.data || deleteError.message);
                    let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການລຶບຜູ້ສະໜອງ';
                    if (deleteError.response?.status === 404) {
                        errorMessage = 'ບໍ່ພົບຂໍ້ມູນຜູ້ສະໜອງທີ່ຈະລຶບ';
                    }
                    // Handle specific 400 error from backend check
                    else if (deleteError.response?.status === 400) {
                        errorMessage = deleteError.response.data.message || 'ບໍ່ສາມາດລຶບໄດ້ ເນື່ອງຈາກມີການອ້າງອີງເຖິງ';
                    }
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

export default DeleteSupplier; 