import { useState, useEffect } from 'react';
import {
    Card,
    Avatar,
    Rate,
    Typography,
    Row,
    Col,
    Image,
    Empty,
    Space,
    Statistic,
    Progress,
    Tooltip,
    Button,
    Select
} from 'antd';
import {
    CalendarOutlined,
    StarFilled,
    ExpandAltOutlined,
    PictureOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const THEME = {
    primary: '#1890ff',
    secondary: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    text: {
        primary: '#262626',
        secondary: '#595959',
        light: '#8c8c8c'
    },
    border: {
        light: '#eaeaea',
        highlight: '#91d5ff'
    },
    background: {
        base: '#ffffff',
        light: '#f5f5f5'
    },
    shadows: {
        small: '0 2px 8px rgba(0,0,0,0.1)',
        medium: '0 4px 12px rgba(0,0,0,0.1)',
        large: '0 6px 16px rgba(0,0,0,0.08)'
    },
    borderRadius: {
        small: '8px',
        medium: '12px',
        large: '16px'
    }
};

const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};

const getRelativeTime = (dateString) => {
    const date = new Date(dateString.split(' ')[0].split('/').reverse().join('-'));
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
};

const FeedbackCard = ({ feedback }) => {
    return (
        <Card
            style={{
                marginBottom: '24px',
                borderRadius: THEME.borderRadius.medium,
                overflow: 'hidden',
                boxShadow: THEME.shadows.medium,
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0,0,0,0.05)',
                backgroundColor: '#FFFDF6'
            }}
            className="feedback-card-hover"
            hoverable
        >
            <Row
                gutter={16}
                align="middle"
                style={{
                    padding: '16px',
                    marginBottom: '16px',
                }}
            >
                <Col>
                    <Avatar
                        size={55}
                        style={{
                            backgroundColor: stringToColor(feedback.username),
                            border: '2px solid white',
                            boxShadow: THEME.shadows.small
                        }}
                        className="avatar-pulse"
                    />
                </Col>

                <Col flex="auto">
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <Text strong style={{ fontSize: '16px', color: THEME.text.primary }}>
                            {feedback.username}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                            <Tooltip title={feedback.dateTime}>
                                <CalendarOutlined style={{ marginRight: '4px' }} />
                                {getRelativeTime(feedback.dateTime)}
                            </Tooltip>
                        </Text>
                    </div>
                </Col>

                <Col>
                    <Rate
                        disabled
                        defaultValue={feedback.rating}
                        style={{ fontSize: '18px' }}
                    />
                </Col>
            </Row>

            <Row gutter={24} style={{ padding: '0 16px 16px' }}>
                <Col xs={24} md={15}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{
                            padding: '16px',
                            borderRadius: THEME.borderRadius.small,
                            border: `1px solid ${THEME.border.light}`,
                            backgroundColor: THEME.background.light,
                            textAlign: 'left'
                        }}>
                            <Text strong style={{ fontSize: '16px', color: THEME.text.primary }}>
                                Feedback
                            </Text>
                            <Paragraph style={{
                                marginTop: '8px',
                                fontSize: '15px',
                                lineHeight: '1.6',
                                color: THEME.text.secondary
                            }}>
                                {feedback.feedback}
                            </Paragraph>
                        </div>

                        <div style={{
                            padding: '16px',
                            borderRadius: THEME.borderRadius.small,
                            border: `1px solid ${THEME.border.highlight}`,
                            backgroundColor: 'rgba(230, 247, 255, 0.5)',
                            textAlign: 'left'
                        }}>
                            <Text strong style={{ fontSize: '16px', color: THEME.text.primary }}>
                                Caption
                            </Text>
                            <Paragraph style={{
                                marginTop: '8px',
                                fontSize: '15px',
                                lineHeight: '1.6',
                                color: THEME.text.secondary
                            }}>
                                {feedback.caption}
                            </Paragraph>
                        </div>
                    </Space>
                </Col>

                <Col xs={20} md={9  }>
                    <img src={feedback.imageUrl} alt="Feedback image" />
                </Col>
            </Row>
        </Card>
    );
};

const StatsOverview = ({ feedbacks }) => {
    const avgRating = feedbacks.length > 0 
        ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length
        : 0;
        
    const ratingCounts = [5, 4, 3, 2, 1].map(rating => {
        return {
            rating,
            count: feedbacks.filter(f => f.rating === rating).length,
            percentage: feedbacks.length > 0 
                ? (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100
                : 0
        };
    });

    return (
        <Card
            style={{
                borderRadius: THEME.borderRadius.large,
                marginBottom: '24px',
                boxShadow: THEME.shadows.small
            }}
            className="stats-card"
        >
            <Row
                justify="space-between"
                align="middle"
                style={{
                    marginBottom: '30px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <Col>
                    <Title level={3} style={{ margin: 0, color: THEME.text.primary }}>
                        Overview
                    </Title>
                </Col>
                <Col>
                    <Select
                        style={{ width: 140 }}
                        defaultValue="all"
                    >
                        <Option value="all">All time</Option>
                        <Option value="today">Today</Option>
                        <Option value="week">This week</Option>
                        <Option value="month">This month</Option>
                    </Select>
                </Col>  
            </Row>
            
            <Row gutter={24}>
                <Col xs={24} md={9}>
                    <Statistic
                        title={
                            <Title level={4} style={{ color: THEME.text.primary }}>
                                Average Rating
                            </Title>
                        }
                        value={avgRating.toFixed(1)}
                        precision={1}
                        valueStyle={{ 
                            color: THEME.primary, 
                            fontSize: '36px',
                            fontWeight: 600
                        }}
                        prefix={<StarFilled className="star-pulse" />}
                        suffix={
                            <span style={{ fontSize: '16px', color: THEME.text.light }}>
                                / 5
                            </span>
                        }
                    />
                    <div style={{ marginTop: '12px' }}>
                        <Rate disabled allowHalf value={avgRating} />
                    </div>
                    <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                        Based on {feedbacks.length} reviews
                    </Text>
                </Col>

                <Col xs={24} md={15}>
                    <Title level={4} style={{ color: THEME.text.primary }}>
                        Rating Distribution
                    </Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {ratingCounts.map(item => (
                            <Row key={item.rating} align="middle" gutter={12}>
                                <Col span={2}>
                                    <Space>
                                        <span style={{ color: THEME.text.primary }}>{item.rating}</span>
                                        <StarFilled style={{ color: THEME.warning }} />
                                    </Space>
                                </Col>
                                <Col span={18}>
                                    <Progress
                                        percent={item.percentage}
                                        showInfo={false}
                                        strokeColor={
                                            item.rating >= 4 ? THEME.secondary :
                                            item.rating >= 3 ? THEME.primary :
                                            item.rating >= 2 ? THEME.warning : 
                                            THEME.error
                                        }
                                        size="small"
                                        className="animate-progress"
                                    />
                                </Col>
                                <Col span={4}>
                                    <Text style={{ color: THEME.text.secondary }}>
                                        {item.count} reviews
                                    </Text>
                                </Col>
                            </Row>
                        ))}
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

const Feedback = () => {
    const mockFeedbacks = [
        {
            id: 1,
            username: "JohnSmith",
            rating: 5,
            feedback: "Very useful application, the captions are accurate and detailed! I no longer need to spend time describing images for my website.",
            caption: "A golden retriever with shiny yellow fur running on a white sandy beach, carrying a blue frisbee in its mouth, creating splashes of water around it. The late afternoon sunlight reflects on its wet fur, creating a joyful and energetic scene.",
            imageUrl: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6",
            dateTime: "06/05/2025 14:32:15",
            tags: ["Animals", "Outdoors"]
        },
        {
            id: 2,
            username: "EmmaWilliams",
            rating: 4,
            feedback: "Good feature, but could be improved in terms of accuracy when captioning tech gadgets. However, I'm still very satisfied with the overall experience.",
            caption: "Modern workspace with a silver MacBook Pro placed on an oak wooden desk, next to a black notebook and a white coffee mug with rising steam. Natural light streams through a window creating soft shadows on the tabletop. A small bouquet of lavender in a glass vase sits in the corner of the desk adding a vibrant accent to the workspace.",
            imageUrl: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a",
            dateTime: "05/05/2025 09:15:48",
            tags: ["Technology", "Workspace"]
        },
        {
            id: 3,
            username: "MichaelJohnson",
            rating: 5,
            feedback: "Saves a lot of time for SEO work, the automatic captions are accurate! I used this tool for our company's entire image library and the results are impressive.",
            caption: "Impressive sunset over a tropical beach with the sky transitioning from orange to purple. The last rays of daylight reflect on the water creating a shimmering path of light stretching to the horizon. A few small fishing boats stand out as silhouettes against the vibrant sky, while palm trees along the shore sway gently in the breeze.",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            dateTime: "01/05/2025 17:45:22",
            tags: ["Landscape", "Beach"]
        },
        {
            id: 4,
            username: "SophiaBrown",
            rating: 5,
            feedback: "Great tool for content marketers like me! The captions are natural and engaging, as if written by a human.",
            caption: "A cup of rich black espresso on a pristine white saucer, accompanied by a slice of tiramisu with an even dusting of cocoa powder on top. Roasted coffee beans scattered around create a natural frame. Warm lighting from a hanging lamp highlights the coffee cup and accentuates the golden crema.",
            imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
            dateTime: "29/04/2025 11:20:05",
            tags: ["Food", "Coffee"]
        },
        {
            id: 5,
            username: "DanielWilson",
            rating: 4,
            feedback: "Very convenient for managing content on our company website. Saves a lot of time and effort.",
            caption: "Small urban rooftop garden with herbs and greens growing in ceramic pots and recycled wooden containers. Bright red cherry tomatoes stand out among the green vegetables. A drip irrigation system is delicately installed between the rows of plants. The backdrop features a cityscape with tall buildings, creating a contrast between the green space and urban environment.",
            imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e",
            dateTime: "27/04/2025 16:10:33",
            tags: ["Nature", "Urban"]
        }
    ];

    const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
    const [loading, setLoading] = useState(true);
    const [ratingFilter, setRatingFilter] = useState('all');

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleRatingFilterChange = (value) => {
        setRatingFilter(value);
        
        if (value === 'all') {
            setFeedbacks(mockFeedbacks);
        } else {
            const rating = parseInt(value);
            setFeedbacks(mockFeedbacks.filter(item => item.rating === rating));
        }
    };

    const renderSkeletons = () => {
        return Array(3).fill().map((_, index) => (
            <Card
                key={index}
                style={{
                    marginBottom: '24px',
                    borderRadius: THEME.borderRadius.large,
                    height: '300px',
                    background: 'linear-gradient(to right, #f0f2f5, #e6e9ec, #f0f2f5)',
                    backgroundSize: '200% 100%',
                    animation: 'pulse 1.5s infinite'
                }}
            />
        ));
    };

    return (
        <div>
            <style jsx global>{`
                @keyframes pulse {
                    0% { background-position: 0% 0%; }
                    50% { background-position: 100% 0%; }
                    100% { background-position: 0% 0%; }
                }
                
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                
                @keyframes star-pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                
                @keyframes progress-animate {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                
                .feedback-card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: ${THEME.shadows.large};
                    border-color: ${THEME.border.highlight};
                }
                
                .star-pulse {
                    animation: star-pulse 1.5s infinite;
                }
                
                .avatar-pulse:hover {
                    transform: scale(1.1);
                    transition: transform 0.3s ease;
                }
                
                .zoom-in-out {
                    animation: star-pulse 1.5s infinite;
                }
                
                .animate-progress .ant-progress-bg {
                    transition: all 1.5s ease;
                    animation: progress-animate 1.5s;
                }
                
                .stats-card {
                    transition: all 0.3s ease;
                }
                
                .stats-card:hover {
                    box-shadow: ${THEME.shadows.medium};
                }
            `}</style>

            <StatsOverview feedbacks={mockFeedbacks} />

            {loading ? (
                renderSkeletons()
            ) : (
                <Card
                    style={{
                        borderRadius: THEME.borderRadius.large,
                        overflow: 'hidden',
                        boxShadow: THEME.shadows.small
                    }}
                >
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        paddingBottom: '16px',
                        borderBottom: `1px solid ${THEME.border.light}`
                    }}>
                        <Title level={3} style={{ margin: 0, color: THEME.text.primary }}>
                            Feedbacks
                        </Title>
                        <Select
                            style={{ width: 160 }}
                            defaultValue="all"
                            onChange={handleRatingFilterChange}
                        >
                            <Option value="all">All Ratings</Option>
                            {[5, 4, 3, 2, 1].map(rating => (
                                <Option key={rating} value={`${rating}`}>
                                    <Rate disabled value={rating} style={{ fontSize: '12px' }} />
                                </Option>
                            ))}
                        </Select>
                    </div>
                
                    <div style={{ padding: '16px 0px' }}>
                        {feedbacks.length > 0 ? (
                            feedbacks.map(feedback => (
                                <FeedbackCard key={feedback.id} feedback={feedback} />
                            ))
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_DEFAULT}
                                description={
                                    <span>No feedback matches the selected filter</span>
                                }
                                style={{
                                    padding: '48px'
                                }}
                            />
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Feedback;