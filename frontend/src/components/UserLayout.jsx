import { Layout as LayoutAntd } from "antd";
import { Outlet } from "react-router-dom";
import Header from "./UserHeader";
import Sider from "./UserSider";
import { useState } from "react";


function UserLayout() {

    const [isSiderCollapsed, setIsSiderCollapsed] = useState(true);

    return (
        <LayoutAntd className='fixed top-0 bottom-0 left-0 right-0'>
            <LayoutAntd.Sider 
                collapsible={true}
                collapsed={isSiderCollapsed} 
                theme="light" 
                onCollapse={() => setIsSiderCollapsed(!isSiderCollapsed)}
            >
                <Sider isSiderCollapsed={isSiderCollapsed}/>
            </LayoutAntd.Sider>
  
            <LayoutAntd>
                <LayoutAntd.Header className="!p-0 !bg-white w-full">
                    <Header />
                </LayoutAntd.Header>

                <LayoutAntd.Content 
                    className="bg-gradient-to-b from-[rgba(204,229,255,0.5)] to-[rgba(255,255,255,0.5)] overflow-auto p-2.5"
                    >
                    <Outlet />
                </LayoutAntd.Content>
            </LayoutAntd>
        </LayoutAntd>
    )
}

export default UserLayout;