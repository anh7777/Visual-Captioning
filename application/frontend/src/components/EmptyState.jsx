import { Empty } from "antd";
import { motion } from "framer-motion";

const EmptyState = ({ message = "Không tìm thấy nội dung nào." }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-64"
        >
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span className="text-gray-600 text-lg">{message}</span>}
            />
        </motion.div>
    );
};

export default EmptyState;
