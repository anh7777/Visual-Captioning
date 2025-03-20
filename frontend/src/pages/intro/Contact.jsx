import { Form, Input, Button } from "antd";
import { motion } from "framer-motion";

function Contact() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Data:", values);
  };

  return (
    <div className="flex w-full min-h-full justify-between p-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-lg">
      
      <div className="flex flex-col w-[60%] justify-center gap-5 max-h-[500px]">
        <motion.span 
          className="text-4xl font-extrabold text-red-600 drop-shadow-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Liên hệ ngay với chúng tôi!
        </motion.span>

        <motion.span 
          className="text-lg text-gray-700"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Bạn có câu hỏi, góp ý hoặc cần hỗ trợ?  
          <br />Hãy liên hệ với chúng tôi ngay! Đội ngũ của chúng tôi luôn sẵn sàng giúp bạn.
        </motion.span>
      </div>

      <motion.div 
        className="w-[40%] bg-white p-6 rounded-2xl shadow-xl h-fit"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className="flex flex-col gap-4 !h-fit"
        >
          <Form.Item
            label={<span className="font-semibold text-gray-700">Tên của bạn</span>}
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
          >
            <Input 
              placeholder="Nhập tên của bạn" 
              className="h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:border-red-400 focus:ring focus:ring-red-200 transition-all duration-300"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Email của bạn</span>}
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input 
              placeholder="Nhập email của bạn" 
              className="h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:border-red-400 focus:ring focus:ring-red-200 transition-all duration-300"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Tin nhắn</span>}
            name="message"
            rules={[{ required: true, message: "Vui lòng nhập tin nhắn!" }]}
          >
            <Input.TextArea 
              rows={6} 
              placeholder="Nhập tin nhắn của bạn" 
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-red-400 focus:ring focus:ring-red-200 transition-all duration-300"
            />
          </Form.Item>

          <Form.Item>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                Gửi ngay
              </Button>
            </motion.div>
          </Form.Item>
        </Form>
      </motion.div>
    </div>
  );
}

export default Contact;
