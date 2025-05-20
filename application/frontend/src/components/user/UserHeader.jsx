import { faBell, faUser, faCog, faSignOutAlt, faEnvelope, faLock, faTrash, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Modal, Input, Button, Form, message, Switch } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteState, setMode } from "../../redux/appSlice";
import { useState } from "react";
import { deleteAccount, logout, updateAccount } from "../../services/authService"; 
import { useNavigate } from "react-router-dom";

function UserHeader() {
    const isDarkMode = useSelector((state) => state.app.mode) === 'dark';
    const { fullname, username, email } = useSelector((state) => state.app.user) || {};
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);

    const headerBgColor = isDarkMode ? 'bg-[#1F2937]' : 'bg-white';
    const iconColor = isDarkMode ? 'text-gray-100' : 'text-gray-700';
    const iconHoverColor = isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600';
    const iconHoverBgColor = isDarkMode ? 'hover:bg-[#1F2937]' : 'hover:bg-gray-100';

    const popoverStyles = `
        .ant-popover-content .ant-popover-inner {
            background-color: ${isDarkMode ? '#1F2A44' : '#ffffff'} !important;
            ${!isDarkMode ? 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);' : ''}
        }
        .ant-popover-arrow:before {
            background-color: ${isDarkMode ? '#1F2A44' : '#ffffff'} !important;
        }
    `;

    return (
        <div className={`flex items-center justify-end p-2 h-full w-full ${headerBgColor} ${!isDarkMode ? 'shadow-md' : ''}`}>
            <div className="flex items-center gap-6 sm:gap-4">
                <>
                    <style>{popoverStyles}</style>
                    <Popover
                        content={<NotificationsPopoverContent isDarkMode={isDarkMode} />}
                        trigger="click"
                        classNames={{ root: 'custom-popover-notifications' }}
                    >
                        <FontAwesomeIcon 
                            icon={faBell} 
                            className={`text-[20px] ${iconColor} cursor-pointer p-2 rounded-full ${iconHoverColor} ${iconHoverBgColor} hover:animate-pulse transition-all duration-300`}
                        />
                    </Popover>
                </>
                <>
                    <style>{popoverStyles}</style>
                    <Popover 
                        content={<MainPopoverContent 
                            fullname={fullname} 
                            username={username} 
                            email={email} 
                            isDarkMode={isDarkMode}
                            openAccountModal={() => {
                                setIsAccountModalOpen(true)
                                setIsSettingsModalOpen(false)
                            }}
                            openSettingsModal={() => {
                                setIsSettingsModalOpen(true)
                                setIsAccountModalOpen(false)
                            }}
                        />} 
                        trigger="click" 
                        classNames={{ root: 'custom-popover' }}
                    >
                        <img 
                            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" 
                            className={`h-[40px] sm:h-[36px] rounded-full cursor-pointer ring-2 ${isDarkMode ? 'ring-gray-700' : 'ring-gray-300'} hover:ring-4 hover:ring-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all duration-300 text-transparent`}
                        />
                    </Popover>
                </>
                <AccountModal 
                    isOpen={isAccountModalOpen} 
                    onClose={() => setIsAccountModalOpen(false)} 
                    fullname={fullname} 
                    username={username} 
                    email={email}
                    isDarkMode={isDarkMode}
                />
                <SettingsModal 
                    isOpen={isSettingsModalOpen} 
                    onClose={() => {setIsSettingsModalOpen(false)}}
                    openChangePasswordModal={() => {setIsChangePasswordModalOpen(true)}}
                    openChangeEmailModal={() => {setIsChangeEmailModalOpen(true)}}
                    isDarkMode={isDarkMode}
                />
                <ChangePasswordModal 
                    isOpen={isChangePasswordModalOpen} 
                    onClose={() => setIsChangePasswordModalOpen(false)}
                    isDarkMode={isDarkMode}
                />
                <ChangeEmailModal 
                    isOpen={isChangeEmailModalOpen} 
                    onClose={() => setIsChangeEmailModalOpen(false)}
                    isDarkMode={isDarkMode}
                />
            </div>
        </div>
    );
}

const NotificationsPopoverContent = ({ isDarkMode }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Feature Released",
            message: "Check out the new dashboard customization options!",
            timestamp: "2 minutes ago",
        },
        {
            id: 2,
            title: "Password Changed",
            message: "Your password was successfully updated.",
            timestamp: "1 hour ago",
        },
        {
            id: 3,
            title: "System Maintenance",
            message: "Scheduled maintenance on May 4, 2025, from 2 AM to 4 AM.",
            timestamp: "1 day ago",
        },
    ]);

    // Xác định màu sắc dựa trên chế độ
    const bgColor = isDarkMode ? 'bg-[#1F2A44]' : 'bg-white';
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
    const titleClass = 'text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500';
    const hoverBgColor = isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-gray-100';
    const titleColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
    const messageColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
    const timeColor = isDarkMode ? 'text-gray-500' : 'text-gray-500';
    const emptyTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className={`w-80 max-w-[90vw] ${bgColor} rounded-xl transition-all duration-300 ${!isDarkMode ? 'shadow-lg' : ''}`}>
            <div className={`py-2.5 text-center border-b ${borderColor} flex justify-between items-center px-4`}>
                <span className={titleClass}>
                    Notifications
                </span>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className={`py-4 text-center ${emptyTextColor}`}>
                        No notifications
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`group px-4 py-3 ${hoverBgColor} hover:bg-opacity-80 rounded-xl transition-all duration-300`}
                        >
                            <div className="flex-1">
                                <p className={`text-base ${titleColor} font-medium group-hover:text-blue-500`}>
                                    {notification.title}
                                </p>
                                <p className={`text-sm ${messageColor}`}>
                                    {notification.message}
                                </p>
                                <p className={`text-xs ${timeColor} italic mt-1`}>
                                    {notification.timestamp}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
};

const MainPopoverContent = ({ fullname, openAccountModal, openSettingsModal, isDarkMode}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
      const handleLogout = async () => {
            try {
                await logout();
                localStorage.removeItem('at');
                localStorage.removeItem('hasLoggedIn');
                dispatch(deleteState());
                navigate('/');
            } catch (error) {
                console.error(error.message);
            }
    }

    const bgColor = isDarkMode ? 'bg-[#1F2A44]' : 'bg-white';
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
    const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
    const hoverBgColor = isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-gray-100';
    const hoverTextColor = isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600';
    const iconColor = isDarkMode ? 'text-gray-100' : 'text-gray-600';
    const titleClass = 'text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500';

    return (
        <div className={`w-56 max-w-[90vw] ${bgColor} rounded-xl transition-all duration-300`}>
            <div className={`py-2.5 text-left border-b ${borderColor} px-2.5`}>
                <span className={titleClass}>
                    {fullname || "User"}
                </span>
            </div>
            <div className="py-3 flex flex-col gap-2">
                <button 
                    className={`group flex items-center gap-3 px-2 py-2 w-full ${textColor} ${hoverBgColor} ${hoverTextColor} rounded-xl transition-all duration-300 hover:scale-105 transform`}
                    onClick={openAccountModal}
                >
                    <FontAwesomeIcon icon={faUser} className={iconColor} />
                    <span className="text-base">Account</span>
                </button>
                <button 
                    className={`flex items-center gap-3 px-2 py-2 w-full ${textColor} ${hoverBgColor} ${hoverTextColor} rounded-xl transition-all duration-300 hover:scale-105 transform`}
                    onClick={openSettingsModal}
                >
                    <FontAwesomeIcon icon={faCog} className={`${iconColor} w-4`} />
                    <span className="text-base">Settings</span>
                </button>
                <button
                    className="flex items-center gap-3 px-2 py-2 w-full text-red-500 hover:bg-red-100/30 hover:text-red-600 rounded-xl transition-all duration-300 hover:scale-105 transform"
                    onClick={handleLogout}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500 w-4" />
                    <span className="text-base">Logout</span>
                </button>
            </div>
        </div>
    );
};

const AccountModal = ({ isOpen, onClose, fullname, username, email, isDarkMode }) => {
    // Xác định màu sắc dựa trên chế độ
    const bgColor = isDarkMode ? '#1F2937' : '#ffffff';
    const borderColor = isDarkMode ? '#4B5563' : '#e5e7eb';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
    const itemBgColor = isDarkMode ? 'bg-[#2D3748]' : 'bg-gray-50';
    const itemBorderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
    const labelColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
    const valueColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
    const iconColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
    
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            className="custom-modal"
            styles={{
                content: {
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '24px',
                },
            }}
        >
            <div className="text-center mb-6">
                <h2 className={`text-xl font-semibold ${textColor}`}>
                    Account Details
                </h2>
            </div>
            <div className="space-y-4">
                {[
                    { icon: faUser, label: "Username", value: username || "N/A" },
                    { icon: faUser, label: "Full Name", value: fullname || "N/A" },
                    { icon: faEnvelope, label: "Email", value: email || "N/A" },
                ].map(({ icon, label, value }) => (
                    <div key={label} className={`flex items-center gap-3 p-3 ${itemBgColor} rounded-lg shadow-sm border ${itemBorderColor}`}>
                        <FontAwesomeIcon icon={icon} className={`${iconColor} w-5`} />
                        <div className="flex-1">
                            <span className={`text-sm ${labelColor} font-medium`}>{label}</span>
                            <p className={`text-base ${valueColor} font-semibold`}>{value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

const SettingsModal = ({ isOpen, onClose, openChangePasswordModal, openChangeEmailModal, isDarkMode, setIsDarkMode }) => {
    const bgColor = isDarkMode ? '#1F2937' : '#ffffff';
    const borderColor = isDarkMode ? '#4B5563' : '#e5e7eb';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
    const buttonBgColor = isDarkMode ? 'bg-[#223d63]' : 'bg-blue-50';
    const buttonTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
    const deleteButtonBgColor = isDarkMode ? 'bg-[#223d63]' : 'bg-red-50';
    const dispatch = useDispatch();

    const handleChangeMode = (checked) => {
        const newMode = checked ? 'dark' : 'light';
        dispatch(setMode(newMode))
        localStorage.setItem('mode', newMode);
    }

    
    const handleDeleteAccount = () => {
        Modal.confirm({
            title: "Are you sure you want to delete your account?",
            content: "This action cannot be undone.",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                await deleteAccount(localStorage.getItem('at'));
                await logout();
                localStorage.removeItem('at');
                window.location.reload();
            }
        });
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            className="custom-modal"
            styles={{
                content: {
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '24px',
                },
            }}
        >
            <div className="text-center mb-6">
                <h2 className={`text-xl font-semibold ${textColor}`}>
                    Settings
                </h2>
            </div>
            <div className="space-y-2">
                <div
                    className={`flex items-center gap-3 px-3 py-3 w-full ${buttonTextColor} rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 transform ${buttonBgColor}`}
                >
                    <FontAwesomeIcon icon={faMoon} className={`${isDarkMode ? 'text-gray-100' : 'text-blue-600'} w-5`} />
                    <span className="text-base">Dark Mode</span>
                    <Switch
                        checked={isDarkMode}
                        className="!ml-auto"
                        onClick={handleChangeMode}
                    />
                </div>

                <button
                    className={`flex items-center gap-3 px-3 py-3 w-full ${buttonTextColor} rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 transform ${buttonBgColor}`}
                    onClick={openChangePasswordModal}
                >
                    <FontAwesomeIcon icon={faLock} className={`${isDarkMode ? 'text-gray-100' : 'text-blue-600'} w-5`} />
                    <span className="text-base">Change Password</span>
                </button>
                <button
                    className={`flex items-center gap-3 px-3 py-3 w-full ${buttonTextColor} rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 transform ${buttonBgColor}`}
                    onClick={openChangeEmailModal}
                >
                    <FontAwesomeIcon icon={faEnvelope} className={`${isDarkMode ? 'text-gray-100' : 'text-blue-600'} w-5`} />
                    <span className="text-base">Change Email</span>
                </button>
                <button
                    className={`flex items-center gap-3 px-3 py-3 w-full text-red-500 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 transform ${deleteButtonBgColor}`}
                    onClick={handleDeleteAccount}
                >
                    <FontAwesomeIcon icon={faTrash} className="text-red-500 w-5" />
                    <span className="text-base">Delete Account</span>
                </button>
            </div>
        </Modal>
    );
};

const ChangePasswordModal = ({ isOpen, onClose, isDarkMode }) => {
    const [form] = Form.useForm();

    // Xác định màu sắc dựa trên chế độ
    const bgColor = isDarkMode ? '#1F2937' : '#ffffff';
    const borderColor = isDarkMode ? '#4B5563' : '#e5e7eb';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
    
    const inputBgColor = isDarkMode ? 'bg-[#374151]' : 'bg-white';
    const inputTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
    const inputBorderColor = isDarkMode ? 'border-gray-600' : 'border-gray-300';
    
    const cancelBtnBgColor = isDarkMode ? 'bg-[#374151]' : 'bg-gray-200';
    const cancelBtnTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
    const cancelBtnHoverBgColor = isDarkMode ? 'hover:bg-[#4B5563]' : 'hover:bg-gray-300';

    const handleChangePassword =  async (values) => {
        const formData = {
            current_password: values.password,
            new_password: values.newPassword
        }
        try {
            await updateAccount(formData, localStorage.getItem('at'));
            message.success("Password changed successfully");
            form.resetFields();
            onClose();
        } catch (err) {
            const errorDetail = err.response?.data?.detail;
            if (errorDetail) {
                const formattedErrors = Object.keys(errorDetail).map(field => ({
                    name: field,
                    errors: [errorDetail[field]]
                }));
                form.setFields(formattedErrors);
            } else {
                form.setFields([{ name: 'password', errors: ["Something went wrong"] }]);
            }
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={() => {
                onClose();
                form.resetFields();
            }}
            footer={null}
            centered
            className="custom-modal"
            styles={{
                content: {
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '24px',
                },
            }}
        >
            <div className="text-center mb-6">
                <h2 className={`text-xl font-semibold ${textColor}`}>
                    Change Password
                </h2>
            </div>
            <Form 
                form={form} 
                onFinish={handleChangePassword} 
                layout="vertical"
                className='flex flex-col gap-2.5'
            >
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Please enter current password" }]}
                >
                    <Input.Password
                        prefix={<FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />}
                        placeholder="Current Password"
                        className={`!h-10 ${inputBgColor} ${inputTextColor} ${inputBorderColor} rounded-lg`}
                    />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    rules={[
                        { required: true, message: "Please enter new password" },
                        { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
                    ]}
                >
                    <Input.Password
                        prefix={<FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />}
                        placeholder="New Password"
                        className={`!h-10 ${inputBgColor} ${inputTextColor} ${inputBorderColor} rounded-lg`}
                    />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    rules={[
                        { required: true, message: "Please confirm new password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match"));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />}
                        placeholder="Confirm New Password"
                        className={`!h-10 ${inputBgColor} ${inputTextColor} ${inputBorderColor} rounded-lg`}
                    />
                </Form.Item>
                <Form.Item className="!mb-0">
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={onClose}
                            className={`${cancelBtnBgColor} ${cancelBtnTextColor} ${cancelBtnHoverBgColor} border-none rounded-lg`}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-blue-500 hover:bg-blue-600 border-none rounded-lg"
                        >
                            Change Password
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const ChangeEmailModal = ({ isOpen, onClose, isDarkMode }) => {
    const [form] = Form.useForm();

    // Xác định màu sắc dựa trên chế độ
    const bgColor = isDarkMode ? '#1F2937' : '#ffffff';
    const borderColor = isDarkMode ? '#4B5563' : '#e5e7eb';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
    
    const inputBgColor = isDarkMode ? 'bg-[#374151]' : 'bg-white';
    const inputTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
    const inputBorderColor = isDarkMode ? 'border-gray-600' : 'border-gray-300';
    
    const cancelBtnBgColor = isDarkMode ? 'bg-[#374151]' : 'bg-gray-200';
    const cancelBtnTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
    const cancelBtnHoverBgColor = isDarkMode ? 'hover:bg-[#4B5563]' : 'hover:bg-gray-300';

    const handleChangeEmail = async (values) => {
        const formData = { 
            current_password: values.password,
            email: values.email
        }

        try {
            await updateAccount(formData, localStorage.getItem('at'));
            message.success("Email changed successfully");
            form.resetFields();
            onClose();
        } catch (err) { 
            const errorDetail = err.response?.data?.detail;
            if (errorDetail) {
                const formattedErrors = Object.keys(errorDetail).map(field => ({
                    name: field,
                    errors: [errorDetail[field]]
                }));
                form.setFields(formattedErrors);
            } else {
                form.setFields([{ name: 'password', errors: ["Something went wrong"] }]);
            }
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={() => {
                onClose();
                form.resetFields();
            }}
            footer={null}
            centered
            className="custom-modal"
            styles={{
                content: {
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '24px',
                },
            }}
        >
            <div className="text-center mb-6">
                <h2 className={`text-xl font-semibold ${textColor}`}>
                    Change Email
                </h2>
            </div>
            <Form 
                form={form} 
                onFinish={handleChangeEmail} 
                layout="vertical"
                className="flex flex-col gap-2.5"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: "Please enter new email" }, { type: "email", message: "Invalid email" }]}
                >
                    <Input
                        prefix={<FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />}
                        placeholder="New Email"
                        className={`!h-10 ${inputBgColor} ${inputTextColor} ${inputBorderColor} rounded-lg`}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Please enter password" }]}
                >
                    <Input.Password
                        prefix={<FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />}
                        placeholder="Password"
                        className={`!h-10 ${inputBgColor} ${inputTextColor} ${inputBorderColor} rounded-lg`}
                    />
                </Form.Item>
                <Form.Item className="!mb-0">
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={onClose}
                            className={`${cancelBtnBgColor} ${cancelBtnTextColor} ${cancelBtnHoverBgColor} border-none rounded-lg`}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-blue-500 hover:bg-blue-600 border-none rounded-lg"
                        >
                            Change Email
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserHeader;