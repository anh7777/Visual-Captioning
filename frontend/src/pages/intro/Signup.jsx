import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { signup } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleSignup = async (formData) => {
        const validForm = {
            username: formData.username,
            password: formData.password,
            full_name: formData.full_name
        }
        try {
            await signup(validForm);
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
    <div className='flex items-center flex-col gap-5 p-[15px]'>
        <span className='text-2xl font-bold text-[#CC4156]'>Đăng ký ngay</span>
        <Form
            form={form}
            onFinish={handleSignup}
            className='flex flex-col !gap-[0px] text-left bg-white w-[450px] !pt-[30px] !px-[30px] rounded-4xl border border-[#d4d4d4]'
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
        <div className='flex justify-center gap-1 bg-white w-[250px] py-[4px] rounded-4xl border-[1px] border-[#d4d4d4] cursor-pointer'>
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
            <span>Đăng ký với Google</span>
        </div>
        <div className='flex justify-center gap-1 bg-white w-[250px] py-[4px] rounded-4xl border-[1px] border-[#d4d4d4] cursor-pointer'>
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
        </svg>
            <span>Đăng ký với Facebook</span>
        </div>
    </div>
    );
}

export default Signup;