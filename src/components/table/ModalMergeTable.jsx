import { Button, Modal, Select, Form, message } from 'antd';
import React, { useState } from 'react';
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
            const { selected_tables } = values;

            if (!selected_tables || selected_tables.length < 2) {
                message.error('ກະລຸນາເລືອກໂຕະຢ່າງນ້ອຍ 2 ໂຕະເພື່ອລວມ.');
                return;
            }

            const response = await mergeTableApi(token, selected_tables);
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
            <Button className="bg-blue-500 text-white" onClick={showModal}>ລວມໂຕະ</Button>
            <Modal
                title="ລວມໂຕະ"
                open={isModalOpen}
                onOk={handleMerge}
                onCancel={handleCancel}
                okText="ຢືນຢັນ"
                cancelText="ຍົກເລີກ"
            >
                <Form form={form} layout="vertical" name="merge_table_form">
                    <Form.Item
                        name="selected_tables"
                        label="ເລືອກໂຕະທີ່ຕ້ອງການລວມ"
                        rules={[{ required: true, message: 'ກະລຸນາເລືອກໂຕະຢ່າງນ້ອຍ 2 ໂຕະ', type: 'array', min: 2 }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="ເລືອກໂຕະ"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {tables.map(table => (
                                <Select.Option key={table.id} value={table.id}>
                                    ໂຕະ {table.table_number} <span className='text-[12px] font-light text-gray-500'>({table.status})</span>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalMergeTable;
