import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Select,
  Tag,
  Typography,
  Tooltip,
  Card,
  Badge,
  notification
} from 'antd';
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  FilterOutlined,
  TeamOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text } = Typography;
const { Option } = Select;

const Users = () => {
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalAction, setModalAction] = useState('');
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        {
          key: '1',
          username: 'john_doe',
          fullname: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Admin',
          createdAt: '2024-05-01',
          status: 'active',
        },
        {
          key: '2',
          username: 'jane_smith',
          fullname: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'User',
          createdAt: '2024-04-28',
          status: 'active',
        },
        {
          key: '3',
          username: 'bob_johnson',
          fullname: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          role: 'User',
          createdAt: '2024-04-15',
          status: 'locked',
        },
        {
          key: '4',
          username: 'sarah_williams',
          fullname: 'Sarah Williams',
          email: 'sarah.williams@example.com',
          role: 'Admin',
          createdAt: '2024-03-22',
          status: 'active',
        },
        {
          key: '5',
          username: 'michael_brown',
          fullname: 'Michael Brown',
          email: 'michael.brown@example.com',
          role: 'User',
          createdAt: '2024-05-02',
          status: 'active',
        },
        {
          key: '6',
          username: 'emma_taylor',
          fullname: 'Emma Taylor',
          email: 'emma.taylor@example.com',
          role: 'User',
          createdAt: '2024-04-10',
          status: 'locked',
        }
      ];
      setDataSource(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleModalConfirm = () => {
    if (modalAction === 'lock') {
      lockUser(selectedUserId);
    } else if (modalAction === 'unlock') {
      unlockUser(selectedUserId);
    } else if (modalAction === 'changeRole') {
      changeUserRole(selectedUserId, newRole);
    }
    setIsModalVisible(false);
    setSelectedUserId(null);
  };

  const lockUser = (userId) => {
    setDataSource(prev => 
      prev.map(user => 
        user.key === userId ? { ...user, status: 'locked' } : user
      )
    );
    notification.success({
      message: 'Account Locked',
      description: `Account ${dataSource.find(u => u.key === userId)?.username} has been successfully locked.`,
    });
  };

  const unlockUser = (userId) => {
    setDataSource(prev => 
      prev.map(user => 
        user.key === userId ? { ...user, status: 'active' } : user
      )
    );
    notification.success({
      message: 'Account Unlocked',
      description: `Account ${dataSource.find(u => u.key === userId)?.username} has been successfully unlocked.`,
    });
  };

  const changeUserRole = (userId, role) => {
    setDataSource(prev => 
      prev.map(user => 
        user.key === userId ? { ...user, role } : user
      )
    );
    notification.success({
      message: 'Role Updated',
      description: `Account ${dataSource.find(u => u.key === userId)?.username} has been updated to the role of ${role}.`,
    });
  };

  const filteredData = dataSource.filter(item => {
    const matchSearch = item.username.toLowerCase().includes(searchText.toLowerCase());
    const matchRole = roleFilter === 'all' || item.role === roleFilter;
    return matchSearch && matchRole;
  });

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      render: (text) => <Text strong>{text}</Text>,
      ellipsis: true,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      key: 'fullname',
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: (role) => {
        const color = role === 'Admin' ? 'blue' : 'green';
        return (
          <Tag color={color} className="px-2 py-1 !text-sm">
            {role}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        return status === 'active' ? (
          <Badge status="success" text="Active" className="!text-green-600" />
        ) : (
          <Badge status="error" text="Locked" className="!text-red-600" />
        );
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'active' ? (
            <Tooltip title="Lock Account">
              <Button
                danger
                icon={<LockOutlined />}
                size="small"
                onClick={() => {
                  setSelectedUserId(record.key);
                  setModalAction('lock');
                  setIsModalVisible(true);
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Unlock Account">
              <Button
                type="primary"
                className="!bg-green-500 hover:!bg-green-600"
                icon={<UnlockOutlined />}
                size="small"
                onClick={() => {
                  setSelectedUserId(record.key);
                  setModalAction('unlock');
                  setIsModalVisible(true);
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Assign Role">
            <Button
              icon={<TeamOutlined />}
              size="small"
              onClick={() => {
                setSelectedUserId(record.key);
                setNewRole(record.role);
                setModalAction('changeRole');
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2.5 h-full w-full max-w-[3000px]">  
      <Card className="shadow-sm">
        <div className="flex gap-3 justify-between">
          <Input
            placeholder="Search by username..."
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
          
          <div className='flex gap-3 items-center max-w-[500px]'>
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={(value) => setRoleFilter(value)}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">All Roles</Option>
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
            </Select>

            <Button type="default" icon={<ExportOutlined />}>
              Export
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={false}
            scroll={{ x: 'max-content' }}
            size="middle"
            rowClassName="hover:bg-gray-50"
          />
        </div>
      </Card>
      
      <Modal
        title={modalAction === 'lock' ? "Lock Account" : modalAction === 'unlock' ? "Unlock Account" : "Assign Role"}
        open={isModalVisible && (modalAction === 'lock' || modalAction === 'unlock')}
        onOk={handleModalConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText={modalAction === 'lock' ? "Lock" : "Unlock"}
        cancelText="Cancel"
        okButtonProps={{ danger: modalAction === 'lock' }}
      >
        {modalAction === 'lock' ? (
          <p>Are you sure you want to lock the account of user <Text strong>{dataSource.find(u => u.key === selectedUserId)?.username}</Text>?</p>
        ) : (
          <p>Are you sure you want to unlock the account of user <Text strong>{dataSource.find(u => u.key === selectedUserId)?.username}</Text>?</p>
        )}
      </Modal>
      
      <Modal
        title="Assign User Role"
        open={isModalVisible && modalAction === 'changeRole'}
        onOk={handleModalConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText="Update"
        cancelText="Cancel"
      >
        <div className="mb-4">
          <p>Select role for user <Text strong>{dataSource.find(u => u.key === selectedUserId)?.username}</Text>:</p>
        </div>
        <Select
          style={{ width: '100%' }}
          value={newRole}
          onChange={(value) => setNewRole(value)}
        >
          <Option value="Admin">Admin</Option>
          <Option value="User">User</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default Users;