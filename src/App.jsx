import React from 'react';

import { Layout } from 'antd';

import BookCrud from './components/BookCrud';

import './App.css';

const { Header, Content, Footer } = Layout;

const App = () => (
    <Layout>
        <Header style={{ display: 'flex' }}>
            <div style={{ color: 'white' }}>
                React CRUD
            </div>
        </Header>
        <Content
            style={{
                padding: '0 50px',
            }}
        >
            <div
                className="site-layout-content"
                style={{
                    marginTop: '24px',
                    padding: '24px',
                    background: '#fff',
                }}
            >
                <BookCrud />
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
            React CRUD ©2024 Mark Ma
        </Footer>
    </Layout>
);

export default App;
