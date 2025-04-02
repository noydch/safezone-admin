import { DatePicker, Form, Input, Modal, Select, InputNumber, Row, Col } from 'antd';
import React from 'react';

const ModalBuy = ({ form, isModalOpen, handleCloseModal }) => {
    console.log(isModalOpen);
    const handleSubmit = (values) => {
        console.log("Form Values", values);
        handleCloseModal();
    }

    return (
        <Modal
            title="ເພີ່ມລາຍການສັ່ງຊື້"
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
                <Row gutter={16}>
                    {/* First Column */}
                    <Col span={12}>
                        <Form.Item
                            name="datetime"
                            label="ວັນທີ ແລະ ເວລາ"
                            rules={[{
                                required: true,
                                message: "ກະລຸນາເລືອກວັນທີ ແລະ ເວລາ"
                            }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                showTime format={"DD/MM/YYYY HH:mm"} />
                        </Form.Item>

                        <Form.Item
                            name="supplier"
                            label="ຊື່ຜູ້ສະໜອງ"
                            rules={[{
                                required: true,
                                message: "ກະລຸນາປ້ອນຊື່ຜູ້ສະໜອງ"
                            }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="ເບີໂທຜູ້ສະໜອງ"
                            rules={[{
                                required: true,
                                message: "ກະລຸນາປ້ອນເບີໂທຜູ້ສະໜອງ"
                            }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="expectedReceiveDate"
                            label="ວັນທີຄາດວ່າຈະໄດ້ຮັບ"
                            rules={[{
                                required: true,
                                message: "ກະລຸນາເລືອກວັນທີ"
                            }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format={"DD/MM/YYYY"} />
                        </Form.Item>
                    </Col>

                    {/* Second Column */}
                    <Col span={12}>
                        <Form.Item
                            name="productName"
                            label="ຊື່ສິນຄ້າ"
                            rules={[{
                                required: true,
                                message: "ກະລຸນາປ້ອນຊື່ສິນຄ້າ"
                            }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="productQuantity"
                            label="ຈຳນວນສິນຄ້າ"
                            rules={[{
                                required: true,
                                message: "ກະລຸນາປ້ອນຈຳນວນສິນຄ້າ"
                            }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="productQuantity"
                            label="ລາຄາສິນຄ້າ"
                            rules={[{
                                required: true,
                                message: "ກະລຸນາປ້ອນລາຄາສິນຄ້າ"
                            }]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item
                            name="status"
                            label="ສະຖານະ"
                            rules={[{
                                required: true,
                                message: "ກະລຸນາເລືອກສະຖານະ"
                            }]}
                        >
                            <Select placeholder="ກະລຸນາເລືອກສະຖານະ">
                                <Select.Option value="cancled">ຍົກເລີກ</Select.Option>
                                <Select.Option value="pending">ກຳລັງລໍຖ້າ</Select.Option>
                                <Select.Option value="completed">ສັ່ງຊື້ສຳເລັດ</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalBuy;
