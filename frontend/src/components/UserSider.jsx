import { motion } from "framer-motion";
import { Menu } from 'antd'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChartLine,
    faArrowUpFromBracket,
    faHeadset,
    faComputer,
    faArchive
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

function UserSider({ isSiderCollapsed }) {
    const navigate = useNavigate();

    const items = [
        {
            key: "upload",
            icon: <FontAwesomeIcon icon={faArrowUpFromBracket} />,
            label: "Upload",
            onClick: () => navigate('/upload')
        },
        {
          key: "collection",
          icon: <FontAwesomeIcon icon={faArchive} />,
          label: "Collection",
          onClick: () => navigate('/collection')
        },
        {
            key: "dashboard",
            icon: <FontAwesomeIcon icon={faChartLine} />,
            label: "Dashboard",
        },
        {
          key: "support",
          icon: <FontAwesomeIcon icon={faHeadset} />,
          label: "Support",
        },
    ];

    return (
        <>
            <div 
                className="flex items-center justify-center gap-1 cursor-pointer h-[64px]"
                onClick={() => navigate('/')}
            >
                <FontAwesomeIcon icon={faComputer} className="text-xl text-black"/>
                {!isSiderCollapsed && (
                    <motion.span 
                        className="text-xl text-black font-semibold"
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
                defaultSelectedKeys={["1"]} 
                items={items}
                    
            />
        </>
    )
}

export default UserSider;