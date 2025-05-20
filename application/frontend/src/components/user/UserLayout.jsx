import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Header from "./UserHeader";
import Sider from "./UserSider";
import { useState } from "react";
import { useSelector } from "react-redux";

function UserLayout() {
    const [isSiderCollapsed, setIsSiderCollapsed] = useState(true);
    const isDarkMode = useSelector((state) => state.app.mode) === 'dark';

    const siderBgColor = isDarkMode ? '!bg-[#1F2937]' : '!bg-[#f8fafc]';
    const contentBgColor = isDarkMode ? 'bg-[#20262E]' : 'bg-[#f0f5ff]';
    const siderTriggerColor = isDarkMode ? '#1b212e' : '#e6f0ff';
    
    return (
        <Layout className='fixed top-0 bottom-0 left-0 right-0'>
            <div>
                <style>
                    {`
                        .ant-layout-sider-trigger {
                            background-color: ${siderTriggerColor} !important;
                        }
                        
                        .ant-layout-sider-trigger .anticon {
                            color: ${isDarkMode ? 'white' : '#1F2937'};
                        }
                    `}
                </style>
                <Layout.Sider 
                    collapsible={true}
                    collapsed={isSiderCollapsed} 
                    onCollapse={() => setIsSiderCollapsed(!isSiderCollapsed)}
                    className={`${siderBgColor} h-full w-full not-md:hidden`}
                    theme={isDarkMode ? "dark" : "light"}
                >
                    <Sider isSiderCollapsed={isSiderCollapsed}/>
                </Layout.Sider>
            </div>

            <Layout>    
                <Layout.Header className="!p-0 w-full">
                    <Header/>
                </Layout.Header>

                <Layout.Content 
                    className={`${contentBgColor} !w-full !h-full !overflow-auto`}>
                    <Outlet />
                </Layout.Content>
            </Layout>
        </Layout>
    )
}

export default UserLayout;