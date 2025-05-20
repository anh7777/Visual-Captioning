import { motion } from "framer-motion";
import { Menu } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChartLine,
    faArrowUpFromBracket,
    faHeadset,
    faComputer,
    faArchive
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";


function Sider({ isSiderCollapsed }) {
    const isDarkMode = useSelector((state) => state.app.mode) === 'dark';
    const navigate = useNavigate();
    const items = [
        {
            key: "upload",
            icon: <FontAwesomeIcon icon={faArrowUpFromBracket} className={isDarkMode ? "text-gray-100" : "text-gray-700"} />,
            label: "Upload",
            onClick: () => navigate('/')
        },
        {
            key: "album",
            icon: <FontAwesomeIcon icon={faArchive} className={isDarkMode ? "text-gray-100" : "text-gray-700"} />,
            label: "Album",
            onClick: () => navigate('/album')
        },
        {
            key: "dashboard",
            icon: <FontAwesomeIcon icon={faChartLine} className={isDarkMode ? "text-gray-100" : "text-gray-700"} />,
            label: "Dashboard",
            onClick: () => navigate('/dashboard')
        },
        {
            key: "support",
            icon: <FontAwesomeIcon icon={faHeadset} className={isDarkMode ? "text-gray-100" : "text-gray-700"} />,
            label: "Support",
            onClick: () => navigate('/support')
        },
    ];

    // Theme styles based on mode
    const headerStyles = isDarkMode 
        ? "bg-[#1b212e]" 
        : "bg-white border-b border-gray-200";
    
    const logoTextColor = isDarkMode 
        ? "text-gray-100 group-hover:text-blue-400" 
        : "text-gray-800 group-hover:text-blue-500";
    
    const logoIconColor = isDarkMode 
        ? "group-hover:text-blue-400" 
        : "text-blue-600 group-hover:text-blue-500";
    
    const menuBgColor = isDarkMode 
        ? "!bg-[#1F2937]" 
        : "!bg-gray-50";

    return (
        <>
            <div 
                className={`group flex items-center justify-center gap-2 cursor-pointer h-[64px] px-4 caret-transparent ${headerStyles}`}
                onClick={() => navigate('/')}
            >
                <FontAwesomeIcon 
                    icon={faComputer} 
                    className={`text-xl ${logoIconColor} transition-all duration-300`}
                />
                {!isSiderCollapsed && (
                    <motion.span 
                        className={`text-xl font-semibold ${logoTextColor} transition-all duration-300 select-none`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        CaptionAI
                    </motion.span>
                )}
            </div>

            <div>
                <style>
                    {`
                    /* Dark Mode Styles */
                    .dark-mode .ant-menu-item-selected {
                        background-color: #374151 !important;
                    }
                    .dark-mode .ant-menu-item {
                        color: #F3F4F6 !important;
                        transition: all 0.3s ease;
                    }
                    .dark-mode .ant-menu-item:hover {
                        background-color: #2D3748 !important;
                        color: #60A5FA !important;
                    }
                    
                    /* Light Mode Styles */
                    .light-mode .ant-menu-item-selected {
                        background-color: #EBF5FF !important;
                        color: #2563EB !important;
                    }
                    .light-mode .ant-menu-item {
                        color: #4B5563 !important;
                        transition: all 0.3s ease;
                    }
                    .light-mode .ant-menu-item:hover {
                        background-color: #F3F4F6 !important;
                        color: #2563EB !important;
                    }
                    `}
                </style>
                <div className={isDarkMode ? "dark-mode" : "light-mode"}>
                    <Menu 
                        mode="inline" 
                        items={items}
                        className={menuBgColor}
                        theme={isDarkMode ? "dark" : "light"}
                    />
                </div>
            </div>
        </>
    );
}

export default Sider;