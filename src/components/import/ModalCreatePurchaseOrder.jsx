import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Select, InputNumber, Button, Space, message, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

// --- FIX: Replace unresolved import with a mock object ---
// In a real project, you would import this from your actual config file.
const ApiPath = {
    getSuppliers: 'http://localhost:5050/api/getSuppliers',
    getDrink: 'http://localhost:5050/api/getDrink',
    getAllProductUnits: 'http://localhost:5050/api/getAllProductUnits',
    createPurchaseOrder: 'http://localhost:5050/api/createPurchaseOrder',
};


const { Option } = Select;

const ModalCreatePurchaseOrder = ({ visible, onClose, onPurchaseOrderCreated }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // State for data fetched from API
    const [suppliers, setSuppliers] = useState([]);
    const [drinks, setDrinks] = useState([]);
    // ✨ Store product units in an object, keyed by drinkId, for efficient lookup
    const [productUnitsByDrink, setProductUnitsByDrink] = useState({});

    // State for loading indicators
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);

    // --- Fetch initial data (Suppliers and all Drinks) ---
    const fetchInitialData = useCallback(async () => {
        if (!visible) return;
        setLoadingInitial(true);
        try {
            const [suppliersRes, drinksRes] = await Promise.all([
                axios.get(ApiPath.getSuppliers),
                axios.get(ApiPath.getDrink)
            ]);
            setSuppliers(suppliersRes.data);
            setDrinks(drinksRes.data);
        } catch (error) {
            console.error("Error fetching initial data:", error);
            message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນເລີ່ມຕົ້ນໄດ້');
        } finally {
            setLoadingInitial(false);
        }
    }, [visible]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // ✨ --- Function to fetch Product Units when a Drink is selected ---
    const handleDrinkChange = async (drinkId, fieldKey) => {
        // Clear dependent fields in the form for that specific row
        const details = form.getFieldValue('details') || [];
        details[fieldKey] = {
            ...details[fieldKey],
            productUnitId: undefined, // Reset product unit selection
            price: undefined,         // Reset price
        };
        form.setFieldsValue({ details });

        // Fetch new units if not already fetched
        if (drinkId && !productUnitsByDrink[drinkId]) {
            setLoadingUnits(true);
            try {
                const response = await axios.get(`${ApiPath.getAllProductUnits}?drinkId=${drinkId}`);
                setProductUnitsByDrink(prev => ({ ...prev, [drinkId]: response.data }));
            } catch (error) {
                console.error(`Error fetching product units for drink ${drinkId}:`, error);
                message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໜ່ວຍສິນຄ້າໄດ້');
            } finally {
                setLoadingUnits(false);
            }
        }
    };

    // ✨ --- Function to auto-fill price when a Product Unit is selected ---
    const handleUnitChange = (unitId, fieldKey) => {
        const drinkId = form.getFieldValue(['details', fieldKey, 'drinkId']);
        const selectedUnit = productUnitsByDrink[drinkId]?.find(unit => unit.id === unitId);

        if (selectedUnit) {
            const details = form.getFieldValue('details');
            details[fieldKey] = {
                ...details[fieldKey],
                price: selectedUnit.price, // Auto-fill the price
            };
            form.setFieldsValue({ details });
        }
    };

    // --- Handle Form Submission ---
    const handleSubmit = async (values) => {
        setSubmitting(true);
        if (!values.details || values.details.length === 0) {
            message.error('ກະລຸນາເພີ່ມລາຍການສັ່ງຊື້ຢ່າງໜ້ອຍ 1 ລາຍການ');
            setSubmitting(false);
            return;
        }

        try {
            // ✨ --- Build the CORRECT payload for the backend ---
            const payload = {
                supplierId: values.supplierId,
                details: values.details.map(item => ({
                    productUnitId: item.productUnitId, // Use productUnitId
                    quantity: item.quantity,
                    price: item.price
                }))
            };
            console.log("Creating Purchase Order with payload:", payload);

            await axios.post(ApiPath.createPurchaseOrder, payload);

            message.success('ສ້າງລາຍການສັ່ງຊື້ສຳເລັດ!');
            onPurchaseOrderCreated(); // Refresh the table on the main page
            handleClose();

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງລາຍການສັ່ງຊື້';
            console.error("Error creating purchase order:", error.response?.data || error.message);
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setProductUnitsByDrink({}); // Clear cached units
        onClose();
    }

    return (
        <Modal
            title="ເພີ່ມລາຍການສັ່ງຊື້ (Purchase Order)"
            open={visible}
            onCancel={handleClose}
            onOk={() => form.submit()}
            okText="ບັນທຶກ"
            cancelText="ຍົກເລີກ"
            width={900}
            confirmLoading={submitting}
            destroyOnClose
        >
            <Spin spinning={loadingInitial}>
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
                        <Select placeholder="ເລືອກຜູ້ສະໜອງ" showSearch filterOption={(input, option) =>
                            (option.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }>
                            {suppliers.map(supplier => (
                                <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <h3 style={{ marginBottom: 16 }}>ລາຍການເຄື່ອງດື່ມທີ່ຈະສັ່ງຊື້:</h3>

                    <Form.List name="details">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        {/* Drink Selection */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'drinkId']}
                                            label="ເຄື່ອງດື່ມ"
                                            rules={[{ required: true, message: 'ເລືອກເຄື່ອງດື່ມ' }]}
                                            style={{ minWidth: 200 }}
                                        >
                                            <Select placeholder="ເຄື່ອງດື່ມ" onChange={(value) => handleDrinkChange(value, key)}>
                                                {drinks.map(drink => (
                                                    <Option key={drink.id} value={drink.id}>{drink.name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        {/* ✨ Product Unit Selection */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'productUnitId']}
                                            label="ໜ່ວຍ"
                                            rules={[{ required: true, message: 'ເລືອກໜ່ວຍ' }]}
                                            style={{ minWidth: 200 }}
                                        >
                                            <Select placeholder="ໜ່ວຍ" loading={loadingUnits} onChange={(value) => handleUnitChange(value, key)}>
                                                {(productUnitsByDrink[form.getFieldValue(['details', name, 'drinkId'])] || []).map(unit => (
                                                    <Option key={unit.id} value={unit.id}>{unit.name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        {/* Quantity */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            label="ຈຳນວນ"
                                            rules={[{ required: true, message: 'ໃສ່ຈຳນວນ' }]}
                                        >
                                            <InputNumber min={1} placeholder="ຈຳນວນ" style={{ width: 100 }} />
                                        </Form.Item>

                                        {/* Price */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'price']}
                                            label="ລາຄາ/ໜ່ວຍ"
                                            rules={[{ required: true, message: 'ໃສ່ລາຄາ' }]}
                                        >
                                            <InputNumber placeholder="ລາຄາ" style={{ width: 150 }} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\,/g, '')} />
                                        </Form.Item>

                                        <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: '30px' }} />
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
