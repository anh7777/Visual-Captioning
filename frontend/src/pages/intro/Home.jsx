import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
    const navigate = useNavigate();

    return (
        <motion.div 
            className="flex flex-col gap-[150px] overflow-y-auto overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex gap-[20px]">
                <motion.div 
                    className="w-[55%]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <img src="/image.png" className="w-full rounded-[30px] shadow-lg" />
                </motion.div>

                <div className="flex flex-col flex-1 gap-[20px] items-center justify-center">
                    <span className="text-[30px] font-bold text-red-500 drop-shadow-md">
                        Trình tạo phụ đề cho ảnh và video
                    </span>
                    <span className="text-gray-600 mt-2 text-xl text-center">
                        Tạo phụ đề ngay lập tức cho video của bạn và tiếp cận khán giả toàn cầu!
                        Phần mềm tạo phụ đề video tự động.
                    </span>
                    <Button
                        onClick={() => navigate('/login')}
                    >
                        Khám Phá Ngay
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-[20px] items-center">
                <span className="text-[30px] font-bold text-red-500 drop-shadow-md">
                    Những sản phẩm nổi bật
                </span>

                <div className="flex gap-[20px]">
                    {["/image.png", "/image.png", "/image.png", "/image.png"].map((src, index) => (
                        <motion.div 
                            key={index}
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-2xl overflow-hidden shadow-md"
                        >
                            <img
                                src={src}
                                alt={`Product ${index + 1}`}
                                className="cursor-pointer"
                            />
                        </motion.div>
                    ))}
                </div>

                <Button
                    onClick={() => navigate('/product')}
                >
                    Xem thêm
                </Button>
            </div>

            <div className="flex items-center">
                <div className="w-1/2 flex flex-col gap-[20px] items-center">
                    <h2 className="text-3xl font-bold text-red-500 drop-shadow-md">
                        AI Caption Generator!
                    </h2>
                    <p className="text-gray-600 mt-2 text-xl text-center">
                        AI Caption Generator – Tạo caption cho ảnh chỉ trong vài giây
                    </p>
                    <Button
                        onClick={() => navigate('/about-us')}
                    >
                        <p className="text-lg">Về chúng tôi</p>
                    </Button>
                </div>

                <motion.div 
                    className="w-1/2 flex justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <img src="/image.png" className="w-1/2 rounded-full shadow-lg" />
                </motion.div>
            </div>

            <div className="flex flex-col items-center gap-[10px]">
                <span className="text-3xl font-bold text-red-500 drop-shadow-md">
                    Khách hàng nói gì?
                </span>
                <motion.span 
                    className="text-xl italic text-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    "Tôi không còn phải mất hàng giờ nghĩ caption cho hình ảnh!"
                </motion.span>
                <motion.span 
                    className="text-lg font-semibold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    Linh Nguyễn, Blogger
                </motion.span>
            </div>
        </motion.div>
    );
}

export default Home;
