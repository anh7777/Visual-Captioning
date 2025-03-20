import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Input, Spin, Empty, Modal, Typography, Divider, message, Button } from 'antd';
import { LoadingOutlined, FileImageOutlined, VideoCameraOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { fetchAllMediaOfCollection, fetchMediaCaption } from "../../services/mediaService";

const { Title, Text, Paragraph } = Typography;

function Media() {
    const { id } = useParams();
    const [columns, setColumns] = useState(3);
    const [media, setMedia] = useState([]);
    const [filteredMedia, setFilteredMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [captionText, setCaptionText] = useState("");
    const [isCaptionLoading, setIsCaptionLoading] = useState(false);

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

    // Fetch media data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchAllMediaOfCollection(id, localStorage.getItem('at'));
                setMedia(data);
                setFilteredMedia(data);
            } catch (error) {
                console.error('Error fetching media:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Search functionality
    const handleSearch = useCallback((value) => {
        const searchTerm = value.toLowerCase().trim();
        if (!searchTerm) {
            setFilteredMedia(media);
            return;
        }
        
        const results = media.filter(item => 
            item.media_name.toLowerCase().includes(searchTerm)
        );
        setFilteredMedia(results);
    }, [media]);

    // Function to show modal and fetch caption details
    const showCaptionModal = async (mediaItem) => {
        setSelectedMedia(mediaItem);
        setIsModalOpen(true);
        setIsCaptionLoading(true);
        
        try {
            // Fetch caption as a string
            const captionString = await fetchMediaCaption(mediaItem.media_id, localStorage.getItem('at'));
            setCaptionText(captionString || "");
        } catch (error) {
            console.error('Error fetching caption:', error);
            setCaptionText("");
        } finally {
            setIsCaptionLoading(false);
        }
    };

    // Function to close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMedia(null);
        setCaptionText("");
    };

    // Empty state component to reuse
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center w-full h-64">
            <Empty 
                description="Không tìm thấy dữ liệu" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-between gap-4 w-full h-full">
            {/* Search Bar */}
            <div className='w-full bg-[#F7F7F7] rounded-lg p-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg'>
                <Input.Search
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                    placeholder='Tìm kiếm hình ảnh'
                    enterButton
                    allowClear
                    style={{ width: '100%' }}
                />
            </div>

            {/* Media Gallery */}
            <div className='w-full h-full max-w-[1860px] bg-white p-4 rounded-2xl'>
                {filteredMedia.length > 0 ? (
                    <ImageList variant="masonry" cols={columns} gap={20}>
                        {filteredMedia.map((item) => (
                            <ImageListItem key={item.media_id}>
                                <div className="bg-[#333333] p-2.5 rounded-2xl">                                
                                    {item.media_type === 'video' ? (
                                        <video 
                                            controls 
                                            width="100%" 
                                            className="cursor-pointer rounded-xl"
                                        >
                                            <source src={item.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <LazyLoadImage 
                                            src={item.url}
                                            alt={item.media_name}
                                            placeholderSrc='/placeholder-image.jpg'
                                            className="min-h-40 object-cover rounded-xl w-full"
                                        />
                                    )}

                                    <ImageListItemBar
                                        sx={{
                                            textAlign: 'left',
                                            borderTopLeftRadius: '16px',
                                            borderTopRightRadius: '16px'
                                        }}
                                        title={item.media_name}
                                        position="top"
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'white' }}
                                                aria-label={`info ${item.media_name}`}
                                                onClick={() => showCaptionModal(item)}
                                            >
                                                <InfoIcon />
                                            </IconButton>
                                        }
                                        actionPosition="left"
                                    />
                                </div>
                            </ImageListItem>
                        ))}
                    </ImageList>
                ) : (
                    <EmptyState />
                )}
            </div>

            {/* Caption Modal */}
            <CaptionModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mediaItem={selectedMedia}
                captionText={captionText}
                isLoading={isCaptionLoading}
            />
        </div>
    );
}

const CaptionModal = ({ isOpen, onClose, mediaItem, captionText, isLoading }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(captionText);
        setCopied(true);
        message.success("Đã sao chép caption!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mediaItem) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
        >
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-6 p-4">
                    {/* Media Preview */}
                    <div className="flex flex-col items-center gap-2.5 justify-center w-1/3 overflow-hidden rounded-lg py-2.5">
                        {mediaItem.media_type === "video" ? (
                            <video controls width="100%" className="rounded-lg">
                                <source src={mediaItem.url} type="video/mp4" />
                            </video>
                        ) : (
                            <LazyLoadImage
                                src={mediaItem.url}
                                alt={mediaItem.media_name}
                                className="w-full h-auto rounded-lg object-cover"
                            />
                        )}
                            <Title level={4} className="!p-0">
                                {mediaItem.media_name}
                            </Title>
                    </div>

                    {/* Caption Section */}
                    <div className="w-full">
                        <div className="flex justify-between items-center mt-2">
                            <Title level={2} className="!m-0">Caption</Title>
                            {captionText && (
                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
                                    onClick={copyToClipboard}
                                    className={`transition-all duration-300 ${
                                        copied ? "!bg-green-500" : "!bg-blue-500"
                                    }`}
                                >
                                    {copied ? "Đã sao chép!" : "Copy"}
                                </Button>
                            )}
                        </div>

                        <Divider className="my-2" />

                        {captionText ? (
                            <div className="bg-gray-50 p-4 rounded-lg shadow-inner min-h-40 transition-all duration-300 hover:shadow-lg">
                                <Paragraph
                                    ellipsis={{ rows: 12, expandable: true, symbol: "Xem thêm" }}
                                    className="!text-xl"
                                >
                                    {captionText}
                                </Paragraph>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <Empty
                                    description="Không có nội dung caption"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};


export default Media;
