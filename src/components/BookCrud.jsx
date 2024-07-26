import React from 'react';

import {
    useCreateBookMutation as useCreateMutation,
    useDeleteBookMutation as useDeleteMutation,
    useGetBookQuery as useGetQuery,
    useGetBooksQuery as useListQuery,
    useUpdateBookMutation as useUpdateMutation,
} from '../api/bookApi';

import Crud from './Crud';

const apiHooks = {
    useGetQuery,
    useListQuery,
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation,
};

const BookCrud = () => {
    const fields = [
        {
            label: '#',
            name: 'id',
            type: 'number',
            readOnly: true,
        },
        {
            label: '書名',
            name: 'title',
            type: 'string',
            required: true,
        },
        {
            label: '簡介',
            name: 'brief',
            type: 'text',
            hidden: true,
        },
        {
            label: '作者',
            name: 'author',
            type: 'string',
            required: true,
        },
        {
            label: '已出版',
            name: 'has_published',
            type: 'boolean',
        },
        {
            label: '庫存',
            name: 'stock',
            type: 'number',
            required: true,
        },
        {
            label: '註冊日期',
            name: 'register_date',
            type: 'date',
            required: true,
        },
        {
            label: '建立時間',
            name: 'created_at',
            type: 'datetime',
            format: 'YYYY-MM-DD HH:mm',
            readOnly: true,
        },
    ];

    return (
        <Crud
            apiHooks={apiHooks}
            fields={fields}
            enablePagination
        />
    );
};

export default BookCrud;
