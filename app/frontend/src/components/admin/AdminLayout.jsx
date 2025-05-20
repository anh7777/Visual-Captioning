import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sider from './AdminSider';
import Header from './AdminHeader';


function AdminLayout() {
    const [isSiderCollapsed, setIsSiderCollapsed] = useState(false);
  
  return (
    <Layout className='fixed top-0 bottom-0 left-0 right-0'>
        <>
            <style>
                {`
                    .admin-sider .ant-layout-sider-trigger {
                        background-color: #f0f2f5 !important;
                        color: black !important;
                    }
                `}
            </style>    
            <Layout.Sider 
                collapsible={true}
                collapsed={isSiderCollapsed} 
                onCollapse={() => setIsSiderCollapsed(!isSiderCollapsed)}
                className='admin-sider'

            >
              <Sider isSiderCollapsed={isSiderCollapsed}/>
            </Layout.Sider>
        </>
      
      <Layout>
        <Layout.Header className='!p-0 w-full'>
          <Header/>
        </Layout.Header>
        
        <Layout.Content
          className="!p-[15px] !w-full !h-full !bg-[#F8FAFC] !overflow-auto"
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;