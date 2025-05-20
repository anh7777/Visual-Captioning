import { Carousel } from 'antd';
import { motion } from 'framer-motion';

function AboutUs() {
const images = [
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&q=80"
];

const teamMembers = [
    {
        name: "Nguyễn Minh Anh",
        role: "AI Research Lead",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&q=80",
        description: "Expert in machine learning and natural language processing with over 8 years of experience."
    },
    {
        name: "Trần Đức Hải",
        role: "Computer Vision Specialist",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop&q=80",
        description: "Passionate about researching and developing cutting-edge computer vision solutions."
    },
    {
        name: "Phạm Thu Hà",
        role: "Product Manager",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&q=80",
        description: "Product development expert with a strong user-centered approach."
    },
    {
        name: "Lê Quang Minh",
        role: "Full-stack Developer",
        image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=300&h=300&fit=crop&q=80",
        description: "Experienced software engineer in building AI-powered applications."
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
    hidden: { y: 30, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { duration: 0.6 }
    }
};

return (
    <motion.div 
        className="flex flex-col items-center w-full p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
    >
        {/* Carousel Section */}
        <motion.div 
            className="w-full max-w-[1250px] min-w-[850px] mb-16 not-md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <Carousel
                autoplay
                autoplaySpeed={4000}
                draggable={true}
                pauseOnHover={false}
                pauseOnFocus={false}
                effect="fade"
                dots={{ className: "custom-dots" }}
            >
            {images.map((src, index) => (
                <div key={index}>
                    <div className="relative">
                        <img 
                            src={src} 
                            alt={`Slide ${index + 1}`} 
                            className='rounded-2xl h-[500px] w-full object-cover shadow-xl'
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"/>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h3 className="text-3xl font-bold mb-2">
                                {index === 0 ? "Expert Team" : 
                                index === 1 ? "Advanced Technology" : 
                                index === 2 ? "Relentless Innovation" : "Effective Collaboration"}
                            </h3>
                            <p className="text-xl">
                                {index === 0 ? "Top AI experts in Vietnam" : 
                                index === 1 ? "Utilizing the most advanced AI technology" : 
                                index === 2 ? "Continuously innovating and improving" : "Growing through strong collaboration"}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            </Carousel>
        </motion.div>

        {/* About Us Text */}
        <motion.div 
            className="flex flex-col items-center text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
        >
            <h2 className="text-4xl not-md:text-2xl font-bold text-red-500 mb-6">About Us</h2>
            <p className="mt-2 text-xl not-md:text-base text-gray-700 max-w-[900px] leading-relaxed">
                We are a team specializing in Artificial Intelligence (AI), Natural Language Processing (NLP), and Computer Vision, passionate about building solutions to optimize digital content.
            </p>
            <p className="mt-4 text-xl not-md:text-base text-gray-700 max-w-[900px] leading-relaxed">
                Our mission is to make AI accessible for everyone by developing smart solutions that help generate high-quality content quickly and efficiently.
            </p>
        </motion.div>

        {/* Core Values Section */}
        <motion.div 
            className="w-full max-w-[1250px] mb-16 px-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <motion.h3 
                className="text-3xl not-md:text-2xl font-bold text-red-500 text-center mb-8"
                variants={itemVariants}
            >
                Core Values
            </motion.h3>
            
            <div className="grid grid-cols-3 gap-8 not-md:grid-cols-1">
                <motion.div 
                    className="bg-white p-8 rounded-2xl shadow-lg"
                    variants={itemVariants}
                    whileHover={{ y: -10, boxShadow: "0px 15px 30px rgba(0,0,0,0.1)" }}
                >
                    <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 not-md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h4 className="text-2xl not-md:text-xl font-bold mb-3">Innovation</h4>
                    <p className="text-gray-700">Constantly seeking creative and breakthrough solutions to tackle complex challenges.</p>
                </motion.div>
            
                <motion.div 
                    className="bg-white p-8 rounded-2xl shadow-lg"
                    variants={itemVariants}
                    whileHover={{ y: -10, boxShadow: "0px 15px 30px rgba(0,0,0,0.1)" }}
                >
                    <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 not-md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    </div>
                    <h4 className="text-2xl not-md:text-xl font-bold mb-3">Quality</h4>
                    <p className="text-gray-700">Committed to delivering the highest quality products and services to our customers.</p>
                </motion.div>
            
                <motion.div 
                    className="bg-white p-8 rounded-2xl shadow-lg"
                    variants={itemVariants}
                    whileHover={{ y: -10, boxShadow: "0px 15px 30px rgba(0,0,0,0.1)" }}
                >
                    <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 not-md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    </div>
                    <h4 className="text-2xl not-md:text-xl font-bold mb-3">Trust</h4>
                    <p className="text-gray-700">We build long-lasting relationships based on transparency, integrity, and reliability.</p>
                </motion.div>
            </div>
        </motion.div>
    </motion.div>
);
}

export default AboutUs;
