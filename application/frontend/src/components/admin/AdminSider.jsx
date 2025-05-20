import { motion } from "framer-motion";
import { Menu } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faGear,
    faComputer,
    faUsers,
    faComments
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

function Sider({ isSiderCollapsed }) {
    const navigate = useNavigate();

    const items = [
        {
            key: "dashboard",
            icon: <FontAwesomeIcon icon={faChartLine} />,
            label: "Dashboard",
            onClick: () => navigate('/'),
        },
        {
            key: "users",
            icon: <FontAwesomeIcon icon={faUsers} />,
            label: "Users",
            onClick: () => navigate('/users'),
        },
        {
            key: "feedback",
            icon: <FontAwesomeIcon icon={faComments} />,
            label: "Feedback",
            onClick: () => navigate('/feedback'),
        }
    ];

    return (
        <>
            <div
                className="flex items-center justify-center gap-2 cursor-pointer h-[64px] px-4 bg-white border-b"
                onClick={() => navigate('/')}
            >
                <FontAwesomeIcon
                    icon={faComputer}
                    className="text-xl text-slate-700"
                />
                {!isSiderCollapsed && (
                    <motion.span
                        className="text-xl text-slate-800 font-semibold caret-transparent"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        CaptionAI
                    </motion.span>
                )}
            </div>

            <Menu
                mode="inline"
                items={items}
                className="!bg-[#F8FAFC] min-h-screen pt-2 !caret-transparent"
                theme="light"
            />
        </>
    );
}

export default Sider;