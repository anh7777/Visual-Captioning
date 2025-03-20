import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { fetchAllCollections } from '../../services/collectionService';
import { Input, Modal, Button, Form, message, Spin } from 'antd';
import { PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { createCollection } from '../../services/collectionService';
import EmptyState from '../../components/EmptyState';

function Collection() {
    const navigate = useNavigate();
    const [columns, setColumns] = useState(3);
    const [collections, setCollections] = useState([]);
    const [filteredCollections, setFilteredCollections] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [openCreation, setOpenCreation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Responsive columns setup
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 800) {
                setColumns(1);
            } else if (window.innerWidth > 800 && window.innerWidth <= 1250) {
                setColumns(2);
            } else {
                setColumns(4);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Fetch collections data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchAllCollections(localStorage.getItem('at'));
                setCollections(data);
                setFilteredCollections(data);
            } catch (error) {
                console.error('Error fetching collections:', error);
                message.error('Không thể tải dữ liệu bộ sưu tập');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle search function
    const handleSearch = (value) => {
        const searchTerm = value.toLowerCase().trim();
        if (!searchTerm) {
            setFilteredCollections(collections);
            return;
        }
        
        const results = collections.filter(item => 
            item.collection_name.toLowerCase().includes(searchTerm)
        );
        setFilteredCollections(results);
    };

    // Handle input change (only updates the input value, not filtering)
    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center gap-2.5 w-full h-full'>
            {/* Search bar and Create button */}
            <div className='w-full max-w-[1860px] flex items-center gap-5 bg-[#F7F7F7] rounded-lg p-2'>
                <Input.Search
                    value={searchValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    enterButton
                    placeholder='Tìm kiếm bộ sưu tập'
                    allowClear
                    style={{ width: '100%' }}
                />
                <div 
                    className="cursor-pointer bg-blue-500 text-white py-1.5 px-2.5 rounded-full flex gap-1.5 items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out transform hover:bg-blue-400"
                    onClick={() => setOpenCreation(true)}
                >
                    <PlusCircleOutlined />
                    <span>Tạo mới</span>
                </div>
            </div>

            {/* Collections display */}
            <div className='w-full h-full max-w-[1860px] bg-white p-2.5 rounded-2xl'>
                {filteredCollections.length > 0 ? (
                    <ImageList cols={columns} gap={20}>
                        {filteredCollections.map(({collection_id, collection_name, thumbnail_url}) => (
                            <ImageListItem key={collection_id}>
                                <div className="flex items-center justify-center bg-[#333333] p-2.5 rounded-2xl h-full w-full">                                
                                    <LazyLoadImage 
                                        src={thumbnail_url}
                                        alt={collection_name}
                                        className='min-h-60 object-cover rounded-xl w-full'
                                        placeholderSrc='/placeholder-image.jpg'
                                    />
                                    <ImageListItemBar
                                        position='top'
                                        sx={{
                                            borderRadius: '20px',
                                            height: '100%',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                        title={collection_name}                       
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label={`info about ${collection_name}`}
                                            />
                                        }
                                        onClick={() => navigate(`/collection/${collection_id}`)}
                                    />
                                </div>
                            </ImageListItem>
                        ))}
                    </ImageList>
                ) : (
                    <EmptyState />
                )}       
            </div>
            
            <Creation 
                openCreation={openCreation} 
                setOpenCreation={setOpenCreation} 
                onSuccess={() => {
                    // Refresh collections after successful creation
                    fetchAllCollections(localStorage.getItem('at'))
                        .then(data => {
                            setCollections(data);
                            setFilteredCollections(data);
                        })
                        .catch(error => console.error('Error refreshing collections:', error));
                }}
            />

            {filteredCollections.length > 0 && (
                <Pagination 
                    count={10}
                    color='primary'
                    size='large'
                />
            )}
        </div>
    );
}

const Creation = ({ openCreation, setOpenCreation, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (formData) => {
        setLoading(true);
        try {
            await createCollection(formData, localStorage.getItem('at'));
            setOpenCreation(false); 
            form.resetFields();
            message.success('Bộ sưu tập đã được tạo thành công!');
            if (onSuccess) onSuccess();
        } catch (err) {
            form.setFields([
                {
                    name: 'collection_name',
                    errors: [err.response?.data?.detail || 'Có lỗi xảy ra khi tạo bộ sưu tập']
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={openCreation}
            onCancel={() => setOpenCreation(false)}
            footer={null}
            centered
            width={500}
            className="rounded-xl bg-white shadow-xl"
        >
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">
                Tạo mới bộ sưu tập
            </h2>
            
            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreate}
                requiredMark={false}
            >
                <Form.Item
                    name="collection_name" 
                    label="Tên bộ sưu tập"
                    rules={[
                        {
                            required: true,
                            message: 'Tên bộ sưu tập không thể để trống!',
                        },
                    ]}
                >
                    <Input
                        placeholder="Nhập tên bộ sưu tập"
                        className="rounded-lg shadow-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Form.Item>

                <div className="flex justify-center mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-lg text-white hover:scale-105 transition-all duration-300 ease-in-out"
                        loading={loading}
                        disabled={loading}
                    >
                        Tạo mới
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default Collection;
