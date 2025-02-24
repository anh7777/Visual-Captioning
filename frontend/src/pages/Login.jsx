import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleLogin = async (formData) => {
        try {
            const accessToken = await login(formData.username, formData.password);
            localStorage.setItem('at', accessToken);
            window.location.href = '/';
        } catch (err) {
            if (err.response && err.response.status === 401) {
                form.setFields([
                    {
                        name: 'password',
                        errors: ['Tài khoản hoặc mật khẩu không chính xác']
                    }
                ])
            } else {
                form.setFields([
                    {
                        name: 'password',
                        errors: [err.message]
                    }
                ])
            }
        }
    }

    return (
        <div className='flex flex-col gap-5 w-80 border-2 p-5 rounded-2xl'>
            <Form
                form={form}
                onFinish={handleLogin}
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
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu"
                        className='h-10'
                    />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                </Form.Item>
                    
                <Form.Item>
                    <Button block onClick={() => navigate('/signup')}>
                        Tạo tài khoản mới
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;