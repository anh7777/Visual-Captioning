import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleSignup = async (formData) => {
        try {
            await signup(formData);
            navigate('/login');
        } catch (err) {
            if (err?.response?.status === 400) {
                form.setFields([
                    {
                        name: 'username',
                        errors: ['Tên đăng nhập đã được sử dụng!']
                    }
                ])
            } else {
                form.setFields([
                    {
                        name: 'full_name',
                        errors: ['Đã có lỗi xảy ra, vui lòng thử lại!']
                    }
                ])
            }
        }
    
    }

    return (
    <div className='flex flex-col gap-5 w-80 border-2 p-5 rounded-2xl'>
        <Form
            form={form}
            onFinish={handleSignup}
            className='flex flex-col gap-2 text-left'
        >
            <Form.Item
                name='username'
                rules={[
                    { 
                        required: true, 
                        message: 'Vui lòng nhập tên đăng nhập!' 
                    }
                ]}
                className='text-left'
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder='Tên đăng nhập'
                    className='h-10'
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    { 
                        required: true, 
                        message: 'Vui lòng nhập mật khẩu!' 
                    }
                ]}
                className='text-left'
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                    className='h-10'
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                    { 
                        required: true, 
                        message: 'Vui lòng nhập lại mật khẩu!' 
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve()
                            }
                            return Promise.reject(new Error('Mật khẩu không khớp!'))
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập lại mật khẩu"
                    className='h-10'
                />
            </Form.Item>

            <Form.Item
                name='full_name'
                rules={[
                    { required: true, message: 'Vui lòng nhập họ và tên!' }
                ]}
            >
                <Input
                    prefix={<UserOutlined/>}
                    placeholder='Nhập họ và tên'
                    className='h-10'
                />
            </Form.Item>


            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Đăng ký
                </Button>
            </Form.Item>
                
            <Form.Item>
                <Button block onClick={() => navigate('/login')}>
                    Đã có tài khoản
                </Button>
            </Form.Item>
        </Form>
    </div>
    );
}

export default Signup;