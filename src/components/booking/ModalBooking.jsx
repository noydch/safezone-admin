import React from 'react'
import { Table, DatePicker, Modal, Form, Input, TimePicker, Select } from 'antd';

const ModalBooking = ({ isModalOpen, handleCloseModal, form }) => {
    // const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (values) => {
        console.log('Form values:', values);
        // ຈັດການຂໍ້ມູນທີ່ສົ່ງມາຈາກ form
        handleCloseModal();
    };
    return (
        <Modal
            title="ເພີ່ມລາຍການການຈອງ"
            open={isModalOpen}
            onCancel={handleCloseModal}
            onOk={() => form.submit()}
            okText="ບັນທຶກ"
            cancelText="ຍົກເລີກ"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="datetime"
                    label="ວັນທີ ແລະ ເວລາ"
                    rules={[{ required: true, message: 'ກະລຸນາເລືອກວັນທີ ແລະ ເວລາ' }]}
                >
                    <DatePicker showTime format="DD/MM/YYYY HH:mm" />
                </Form.Item>

                <Form.Item
                    name="tableNo"
                    label="ເລກໂຕະ"
                    rules={[{ required: true, message: 'ກະລຸນາເລືອກເລກໂຕະ' }]}
                >
                    <Select>
                        <Select.Option value="No.1">No.1</Select.Option>
                        <Select.Option value="No.2">No.2</Select.Option>
                        <Select.Option value="No.3">No.3</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="staff"
                    label="ຊື່ພະນັກງານ"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນຊື່ພະນັກງານ' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="customer"
                    label="ຊື່ລູກຄ້າ"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນຊື່ລູກຄ້າ' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="ເບີໂທ"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນເບີໂທ' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalBooking