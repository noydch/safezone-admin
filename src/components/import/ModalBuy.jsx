import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Spin, message, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import ApiPath from '../../api/apiPath';

const { Option } = Select;

const ModalCreatePurchaseOrder = ({ visible, onClose, onPurchaseOrderCreated }) => {
    const [form] = Form.useForm();
    const [suppliers, setSuppliers] = useState([]);
    const [drinks, setDrinks] = useState([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [loadingDrinks, setLoadingDrinks] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (visible) {
            const fetchSuppliers = async () => {
                setLoadingSuppliers(true);
                try {
                    const response = await axios.get(ApiPath.getSuppliers);
                    setSuppliers(response.data);
                } catch (error) {
                    console.error("Error fetching suppliers:", error);
                    message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຜູ້ສະໜອງໄດ້');
                } finally {
                    setLoadingSuppliers(false);
                }
            };

            const fetchDrinks = async () => {
                setLoadingDrinks(true);
                try {
                    const response = await axios.get(ApiPath.getDrink);
                    setDrinks(response.data);
                } catch (error) {
                    console.error("Error fetching drinks:", error);
                    message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນເຄື່ອງດື່ມໄດ້');
                } finally {
                    setLoadingDrinks(false);
                }
            };

            fetchSuppliers();
            fetchDrinks();
        } else {
            form.resetFields();
        }
    }, [visible, form]);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        if (!values.details || values.details.length === 0) {
            message.error('ກະລຸນາເພີ່ມລາຍການສັ່ງຊື້ຢ່າງໜ້ອຍ 1 ລາຍການ');
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                supplierId: values.supplierId,
                details: values.details.map(item => ({
                    drinkId: item.drinkId,
                    quantity: item.quantity,
                    price: item.price
                }))
            };
            console.log("Creating Purchase Order with payload:", payload);

            const response = await axios.post(ApiPath.createPurchaseOrder, payload);
            console.log("Purchase Order created:", response.data);
            message.success('ສ້າງລາຍການສັ່ງຊື້ສຳເລັດ!');
            form.resetFields();
            onPurchaseOrderCreated();
            onClose();

        } catch (error) {
            console.error("Error creating purchase order:", error.response?.data || error.message);
            let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງລາຍການສັ່ງຊື້';
            if (error.response?.status === 400) {
                errorMessage = error.response.data.message || 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ, ກະລຸນາກວດສອບລາຍການສັ່ງຊື້.';
            } else if (error.response?.status === 404) {
                errorMessage = 'ບໍ່ພົບຂໍ້ມູນຜູ້ສະໜອງ.';
            }
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="ເພີ່ມລາຍການສັ່ງຊື້ (Purchase Order)"
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="ບັນທຶກ"
            cancelText="ຍົກເລີກ"
            width={800}
            confirmLoading={submitting}
            destroyOnClose
        >
            <Spin spinning={loadingSuppliers || loadingDrinks}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    name="createPurchaseOrderForm"
                    autoComplete="off"
                >
                    <Form.Item
                        name="supplierId"
                        label="ເລືອກຜູ້ສະໜອງ"
                        rules={[{ required: true, message: 'ກະລຸນາເລືອກຜູ້ສະໜອງ' }]}
                    >
                        <Select placeholder="ເລືອກຜູ້ສະໜອງ" loading={loadingSuppliers} showSearch filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }>
                            {suppliers.map(supplier => (
                                <Option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <h3 style={{ marginBottom: 16 }}>ລາຍການເຄື່ອງດື່ມທີ່ຈະສັ່ງຊື້:</h3>

                    <Form.List name="details">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8, alignItems: 'baseline' }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'drinkId']}
                                            rules={[{ required: true, message: 'ເລືອກເຄື່ອງດື່ມ' }]}
                                            style={{ minWidth: '200px' }}
                                        >
                                            <Select placeholder="ເຄື່ອງດື່ມ" loading={loadingDrinks} showSearch filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }>
                                                {drinks.map(drink => (
                                                    <Option key={drink.id} value={drink.id}>
                                                        {drink.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            rules={[{ required: true, message: 'ໃສ່ຈຳນວນ' }, { type: 'number', min: 1, message: 'ຕ້ອງຫຼາຍກວ່າ 0'}]}
                                        >
                                            <InputNumber placeholder="ຈຳນວນ" style={{ width: '100px' }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'price']}
                                            rules={[{ required: true, message: 'ໃສ່ລາຄາ' }, { type: 'number', min: 0, message: 'ຕ້ອງບໍ່ຕິດລົບ'}]}
                                        >
                                            <InputNumber placeholder="ລາຄາຕໍ່ໜ່ວຍ" style={{ width: '150px' }} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\,/g, '')} />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        ເພີ່ມລາຍການເຄື່ອງດື່ມ
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Spin>
        </Modal>
    );
};

export default ModalCreatePurchaseOrder;
