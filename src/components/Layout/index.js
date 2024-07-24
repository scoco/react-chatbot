/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  MessageOutlined,
  ToolOutlined
} from '@ant-design/icons';
import {
  Button, Layout, theme, Menu
} from 'antd';
import { useNavigate } from 'react-router-dom';
import botConfig from '../../bots.json';

const { Sider } = Layout;
const {
  Header, Content, Footer
} = Layout;

const GlobalLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const generateMenuItems = () => {
      const botChildren = [{
        label: '#Général',
        key: 'chat:general'
      }];

      botChildren.push(...botConfig.bots.map((bot) => ({
        label: bot.name,
        key: `chat:${bot.key.toLowerCase()}`
      })));

      setMenuItems([
        { key: 'home', icon: <HomeOutlined />, label: 'Accueil' },
        {
          key: 'grp',
          label: 'Chat',
          icon: <MessageOutlined />,
          children: botChildren
        },
        { key: 'options', icon: <ToolOutlined />, label: 'Réglages' }
      ]);
    };

    generateMenuItems();
  }, []);

  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    const [path, subkey] = key.split(':');
    navigate(`/${path}`, { state: { subkey } });
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          defaultSelectedKeys={['home']}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          Formation React
        </Header>
        <Content style={{
          margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG
        }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Emilien - React {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout >
  );
};

export default GlobalLayout;
