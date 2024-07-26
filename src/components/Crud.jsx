import React, { useState } from 'react';

import moment from 'moment';
import { IconContext } from 'react-icons';
import { FaCheck, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { MdEdit, MdOutlineAdd } from 'react-icons/md';

import {
    Button,
    DatePicker,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Space,
    Switch,
    Table,
    TimePicker,
} from 'antd';

const getFormComponent = (type) => {
    switch (type) {
        case 'boolean':
            return <Switch />;
        case 'date':
            return <DatePicker />;
        case 'datetime':
            return <DatePicker showTime />;
        case 'number':
            return <Input type="number" />;
        case 'text':
            return <Input.TextArea />;
        case 'time':
            return <TimePicker />;
        case 'string':
        default:
            return <Input />;
    }
};

const renderTableColumn = ({ field, text }) => {
    if (field.type === 'boolean') {
        const color = text ? 'green' : 'red';
        const icon = text ? <FaCheck /> : <FaTimes />;
        return (
            <IconContext.Provider value={{ color }}>
                {icon}
            </IconContext.Provider>
        );
    }

    if (field.type === 'date' && text) {
        return (
            moment(text, 'YYYY-MM-DD').isValid()
                ? moment(text).format(field.format || 'YYYY-MM-DD')
                : 'Invalid date'
        );
    }

    if (field.type === 'datetime' && text) {
        return (
            moment(text, 'YYYY-MM-DD HH:mm:ss').isValid()
                ? moment(text).format(field.format || 'YYYY-MM-DD HH:mm:ss')
                : 'Invalid datetime'
        );
    }

    if (field.type === 'time' && text) {
        return (
            moment(text, 'HH:mm:ss').isValid()
                ? moment(text, 'HH:mm:ss').format(field.format || 'HH:mm:ss')
                : 'Invalid time'
        );
    }

    return text;
};

const Crud = ({ apiHooks, fields, enablePagination = false }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [currentRecord, setCurrentRecord] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        data: listData,
        refetch: refetchList,
        isLoading: isTableLoading,
    } = apiHooks.useListQuery(enablePagination ? { page: currentPage, size: pageSize } : {});
    const [createMutation, { isLoading: isCreating }] = apiHooks.useCreateMutation();
    const [updateMutation, { isLoading: isUpdating }] = apiHooks.useUpdateMutation();
    const [deleteMutation, { isLoading: isDeleting }] = apiHooks.useDeleteMutation();

    const showModal = (record = null) => {
        setCurrentRecord(record);
        setIsModalVisible(true);
        form.resetFields();
        if (record) {
            const recordWithMoment = fields.reduce((acc, field) => {
                if ((['date', 'time', 'datetime'].includes(field.type)) && record[field.name]) {
                    acc[field.name] = (
                        field.type === 'time'
                            ? moment(record[field.name], 'HH:mm:ss')
                            : moment(record[field.name])
                    );
                }
                else {
                    acc[field.name] = record[field.name];
                }
                return acc;
            }, {});
            form.setFieldsValue(recordWithMoment);
        }
        else {
            fields.forEach((field) => {
                if (field.default !== undefined) {
                    form.setFieldValue(field.name, field.default);
                }
            });
        }
    };

    const handleOk = async () => {
        try {
            setIsSubmitting(true);
            let values = await form.validateFields();
            values = fields.reduce((acc, field) => {
                if (field.type === 'date' && values[field.name]) {
                    acc[field.name] = values[field.name].format('YYYY-MM-DD');
                }
                else if (field.type === 'time' && values[field.name]) {
                    acc[field.name] = values[field.name].format('HH:mm:ss');
                }
                else if (field.type === 'datetime' && values[field.name]) {
                    acc[field.name] = values[field.name].format('YYYY-MM-DD HH:mm:ss');
                }
                else {
                    acc[field.name] = values[field.name];
                }
                return acc;
            }, {});

            if (currentRecord) {
                values.id = currentRecord.id;
                await updateMutation(values).unwrap();
                message.success('編輯成功!');
            }
            else {
                await createMutation(values).unwrap();
                message.success('建立成功!');
            }
            refetchList();
            setIsModalVisible(false);
        }
        catch (error) {
            message.error('出了點錯...');
            console.error(error);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        try {
            await deleteMutation(id).unwrap();
            message.success('刪除成功');
            refetchList();
        }
        catch (error) {
            message.error('刪除失敗...');
            console.error(error);
        }
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const columns = [
        ...fields
            .filter((field) => !field.hidden)
            .map((field) => ({
                title: field.label,
                dataIndex: field.name,
                key: field.name,
                render: (text) => renderTableColumn({ field, text }),
            })),
        {
            title: '操作',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button
                        onClick={() => showModal(record)}
                        icon={<MdEdit />}
                    />
                    <Popconfirm
                        title="確定?"
                        description="刪除後將無法復原！"
                        onConfirm={() => handleDelete(record.id)}
                        okText="確認"
                        cancelText="取消"
                    >
                        <Button
                            danger
                            loading={isDeleting}
                            icon={<FaTrashAlt />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Button
                type="primary"
                onClick={() => showModal()}
                icon={<MdOutlineAdd />}
            >
                新增
            </Button>
            <Table
                columns={columns}
                dataSource={
                    enablePagination
                        ? listData?.results
                        : listData
                }
                rowKey="id"
                loading={isTableLoading}
                pagination={
                    enablePagination
                        ? {
                            current: currentPage,
                            pageSize,
                            total: listData?.page?.total_resources,
                            pageSizeOptions: ['5', '10', '20', '50'],
                            showSizeChanger: true,
                            onShowSizeChange: (current, size) => {
                                setCurrentPage(1);
                                setPageSize(size);
                            },
                        }
                        : true
                }
                onChange={handleTableChange}
            />
            <Modal
                title={currentRecord ? '編輯' : '建立'}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={isSubmitting || isCreating || isUpdating}
                onCancel={handleCancel}
                okText={currentRecord ? '儲存' : '建立'}
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    {
                        fields
                            .filter((field) => !field.readOnly)
                            .map((field) => (
                                <Form.Item
                                    key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    rules={
                                        field.rules || (
                                            field.required
                                                ? [
                                                    {
                                                        required: true,
                                                        message: `${field.label} is required`,
                                                    },
                                                ]
                                                : []
                                        )
                                    }
                                >
                                    {getFormComponent(field.type)}
                                </Form.Item>
                            ))
                    }
                </Form>
            </Modal>
        </>
    );
};

export default Crud;
