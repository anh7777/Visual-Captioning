import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
    const navigate = useNavigate();

    const featuredProducts = [
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=350&fit=crop&q=80", // Headphones
        "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=500&h=350&fit=crop&q=80", // Speaker
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=350&fit=crop&q=80", // Headphones gold
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=350&fit=crop&q=80"  // Laptop
    ];

    const testimonials = [
        {
            quote: "I no longer spend hours thinking of captions for my images!",
            author: "Linh Nguyen, Blogger"
        },
        {
            quote: "Automatic subtitles help my videos reach a wider audience.",
            author: "Minh Tran, Content Creator"
        },
        {
            quote: "An excellent AI tool for our brand marketing!",
            author: "Ha Pham, Marketing Manager"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.3 
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div 
            className="flex flex-col gap-[100px] overflow-y-auto overflow-x-hidden p-8 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex not-md:flex-col gap-[40px] items-center bg-white rounded-3xl p-8 shadow-xl max-w-[2056px]">
                <motion.img 
                    src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=600&fit=crop&q=80" 
                    className="md:w-[55%] not-md:hidden rounded-[30px] shadow-lg object-cover h-96"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    whileHover={{ scale: 1.03 }}
                />

                <motion.div 
                    className="flex flex-col flex-1 gap-[25px] items-center justify-center"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    <span className="text-[36px] not-md:text-2xl font-bold text-red-500 drop-shadow-md text-center">
                        Caption Generator for Images and Videos
                    </span>
                    <span className="text-gray-600 mt-2 text-xl not-md:text-base text-center">
                        Create captions instantly for your videos and reach a global audience!
                        Automatic video captioning software powered by AI technology.
                    </span>
                    <Button
                        onClick={() => navigate('/login')}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transform transition hover:scale-105"
                    >
                        Explore Now
                    </Button>
                </motion.div>
            </div>

            <motion.div 
                className="flex flex-col gap-[30px] items-center bg-white rounded-3xl py-8 shadow-xl max-w-[2056px] md:px-[30px]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
            >
                <motion.span 
                    className="text-[36px] not-md:text-2xl font-bold text-red-500 drop-shadow-md"
                    variants={itemVariants}
                >
                    Featured Products
                </motion.span>

                <div className="flex not-md:flex-col gap-[30px] justify-center not-md:px-14">
                    {featuredProducts.map((src, index) => (
                        <motion.div 
                            key={index}
                            whileHover={{ scale: 1.08, rotate: 2, boxShadow: "0px 10px 25px rgba(0,0,0,0.15)" }}
                            transition={{ duration: 0.3 }}
                            className="rounded-2xl shadow-lg not-md:w-full"
                            variants={itemVariants}
                        >
                            <img
                                src={src}
                                alt={`Product ${index + 1}`}
                                className="cursor-pointer w-full object-cover"
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div variants={itemVariants}>
                    <Button
                        onClick={() => navigate('/product')}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transform transition hover:scale-105 mt-6"
                    >
                        View More Products
                    </Button>
                </motion.div>
            </motion.div>

            <div className="flex not-md:flex-col items-center gap-12 bg-gray-50 rounded-3xl p-12 shadow-lg">
                <motion.div 
                    className="md:w-1/2 not-md:w-full flex flex-col gap-[25px] items-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl not-md:text-2xl font-bold text-red-500 drop-shadow-md">
                        AI Caption Generator!
                    </h2>
                    <p className="text-gray-600 mt-2 text-xl not-md:text-base text-center">
                        AI Caption Generator – Create captions for images in just seconds with the most advanced artificial intelligence technology
                    </p>
                    <Button
                        onClick={() => navigate('/about-us')}
                    >
                        <p className="text-lg not-md:text-sm">About Us</p>
                    </Button>
                </motion.div>

                <motion.div 
                    className="w-1/2 not-md:hidden flex justify-center"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=800&fit=crop&q=80" 
                        className="w-3/5 rounded-3xl shadow-xl object-cover h-96" 
                    />
                </motion.div>
            </div>

            <motion.div 
                className="flex flex-col items-center gap-[30px] bg-white rounded-3xl p-12 shadow-xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
            >
                <motion.span 
                    className="text-3xl font-bold text-red-500 drop-shadow-md"
                    variants={itemVariants}
                >
                    What Our Customers Say
                </motion.span>
                
                <div className="flex gap-6 flex-wrap justify-center">
                    {testimonials.map((testimonial, index) => (
                        <motion.div 
                            key={index}
                            className="bg-gray-50 p-6 rounded-2xl shadow-lg max-w-sm"
                            variants={itemVariants}
                            whileHover={{ y: -10, boxShadow: "0px 15px 25px rgba(0,0,0,0.1)" }}
                        >
                            <motion.p className="text-xl italic text-gray-700 mb-4">
                                "{testimonial.quote}"
                            </motion.p>
                            <motion.p className="text-lg font-semibold text-red-500">
                                {testimonial.author}
                            </motion.p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>    
        </motion.div>
    );
}

export default Home;