import { Form, Input, Button } from "antd";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function Contact() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Form Data:", values);
    };

    const [rows, setRows] = useState(window.innerWidth > 768 ? 6 : 3);

    useEffect(() => {
        const handleResize = () => {
            setRows(window.innerWidth > 768 ? 6 : 3);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex w-full min-h-full items-center justify-between rounded-xl">
            <div className="flex flex-col w-[40%] justify-center items-center gap-5 not-lg:hidden">
                <motion.span 
                    className="text-4xl font-extrabold text-red-600 drop-shadow-md"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Contact Us Now!
                </motion.span>

                <motion.span 
                    className="text-lg text-gray-700"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Do you have questions, feedback, or need support?
                    <br />Our team is always ready to help you.
                </motion.span>
            </div>

            <motion.div 
                className="flex flex-col flex-1 min-w-[550px] w-full items-center justify-center py-2.5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                    className="flex flex-col !h-fit w-[80%] bg-white !p-6 rounded-2xl gap-2.5 !pb-0 max-w-[796px]"
                >
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Your Name</span>}
                        name="name"
                        rules={[{ required: true, message: "Please enter your name!" }]}
                        style={{ textAlign: "left" }}
                    >
                        <Input 
                            placeholder="Enter your name" 
                            className="!py-3"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Your Email</span>}
                        name="email"
                        style={{ textAlign: "left" }}
                        rules={[
                            { required: true, message: "Please enter your email!" },
                            { type: "email", message: "Invalid email address!" },
                        ]}
                    >
                        <Input 
                            placeholder="Enter your email" 
                            className='!py-3'
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Subject</span>}
                        name="header"
                        rules={[{ required: true, message: "Please enter the subject!" }]}
                        style={{ textAlign: "left" }}
                    >
                        <Input 
                            placeholder="Enter the subject" 
                            className="!py-3"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Message</span>}
                        name="message"
                        rules={[{ required: true, message: "Please enter your message!" }]}
                        style={{ textAlign: "left" }}
                    >
                        <Input.TextArea 
                            rows={rows} 
                            placeholder="Enter your message" 
                            className="!py-3 !resize-none"
                        />
                    </Form.Item>

                    <Form.Item>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                            >
                                Send Now
                            </Button>
                        </motion.div>
                    </Form.Item>
                </Form>
            </motion.div>
        </div>
    );
}

export default Contact;
