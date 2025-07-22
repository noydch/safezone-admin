import { Button, Modal, Select, Form, message } from 'antd'
import React, { useState } from 'react'
import useSafezoneStore from '../../store/safezoneStore';
import { mergeTableApi } from '../../api/order';

const ModalMergeTable = ({ listTable, tables }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const token = useSafezoneStore((state) => state.token);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleMerge = async () => {
        try {
            const values = await form.validateFields();
            const { source_table, destination_table } = values;

            if (source_table === destination_table) {
                message.error('ໂຕະຕົ້ນທາງ ແລະ ໂຕະປາຍທາງຕ້ອງບໍ່ແມ່ນໂຕະດຽວກັນ!');
                return;
            }

            const response = await mergeTableApi(token, [source_table, destination_table]);
            if (response.status === 200) {
                message.success('ລວມໂຕະສຳເລັດ!');
                listTable(); // Refresh table list
                setIsModalOpen(false);
                form.resetFields();
            } else {
                message.error('ເກີດຂໍ້ຜິດພາດໃນການລວມໂຕະ.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else if (error.isFieldsTouched) {
                // Validation failed, no need to show a generic error
                console.log('Validation Failed:', error);
            } else {
                console.error('Merge table error:', error);
                message.error('ເກີດຂໍ້ຜິດພາດໃນການລວມໂຕະ.');
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <>
            <Button className=' bg-blue-500 text-white' onClick={showModal}>ລວມໂຕະ</Button>
            <Modal title="ລວມໂຕະ" open={isModalOpen} onOk={handleMerge} onCancel={handleCancel} okText="ຢືນຢັນ" cancelText="ຍົກເລີກ">
                <Form form={form} layout="vertical" name="merge_table_form">
                    <Form.Item
                        name="source_table"
                        label="ເລືອກໂຕະຕົ້ນທາງ"
                        rules={[{ required: true, message: 'ກະລຸນາເລືອກໂຕະຕົ້ນທາງ!' }]}
                    >
                        <Select placeholder="ເລືອກໂຕະ">
                            {tables.map(table => (
                                <Select.Option key={table.id} value={table.id}>ໂຕະ {table.table_number} <span className=' text-[12px] font-light text-gray-500'>({table.status})</span></Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="destination_table"
                        label="ເລືອກໂຕະປາຍທາງ"
                        rules={[{ required: true, message: 'ກະລຸນາເລືອກໂຕະປາຍທາງ!' }]}
                    >
                        <Select placeholder="ເລືອກໂຕະ">
                            {tables.map(table => (
                                <Select.Option key={table.id} value={table.id}>ໂຕະ {table.table_number} <span className=' text-[12px] font-light text-gray-500'>({table.status})</span></Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ModalMergeTable 