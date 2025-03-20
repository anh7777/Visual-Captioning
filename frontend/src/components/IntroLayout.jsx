import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Footer from "./IntroFooter";
import Header from "./IntroHeader";

function IntroLayout() {
    return (
        <Layout className='absolute top-0 bottom-0 left-0 right-0'>
            <Layout.Header className="!p-0 !bg-[#FFFAFA] !h-[60px]">
                <Header />
            </Layout.Header>
            <Layout>
                <Layout.Content 
                    className="
                        bg-gradient-to-b 
                        from-[rgba(204,229,255,0.5)] 
                        to-[rgba(255,255,255,0.5)] 
                        overflow-auto"
                >
                    <Outlet />
                </Layout.Content>
            </Layout>
            <Layout.Footer className="!p-0 !bg-[#FFFAFA] !h-[60px]">
                <Footer />
            </Layout.Footer>
        </Layout>
    );
}

export default IntroLayout;