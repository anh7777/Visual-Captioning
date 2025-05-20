import React, { useState, useEffect } from 'react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer
} from "recharts";
import { 
    CheckCircle,
    Database,
    BarChart3,
    HardDrive
} from 'lucide-react';
import { countAlbums } from '../../services/albumService';
import { useSelector } from 'react-redux';


function Dashboard() {
    const mode = useSelector((state) => state.app.mode);
    const isDarkMode = mode === 'dark';

    const BASE_COLORS = [
        "#06b6d4",
        "#f59e0b",
        "#ec4899",
        "#14b8a6",
        "#3b82f6",
        "#8b5cf6",
        "#ef4444",
        "#10b981",
        "#f97316",
        "#6366f1", 
        "#d946ef",
        "#0ea5e9",
        "#f43f5e",
        "#84cc16",
        "#64748b",
    ];

    const [albumData, setAlbumData] = useState([
        { name: "Album A", photos: 15, percentage: 15.3 },
        { name: "Album B", photos: 25, percentage: 25.5 },
        { name: "Album C", photos: 10, percentage: 10.2 },
        { name: "Album D", photos: 18, percentage: 18.4 },
        { name: "Album E", photos: 30, percentage: 30.6 },
    ]);

    const [storageData, setStorageData] = useState([
        { name: "Album A", size: 1024, percentage: 25 },
        { name: "Album B", size: 2048, percentage: 50 },
        { name: "Album C", size: 512, percentage: 12.5 },
        { name: "Album D", size: 512, percentage: 12.5 },
    ]);

    useEffect(() => {
        const fetchAlbumCounts = async () => {
            try {
                const data = await countAlbums(localStorage.getItem('at'));
                setAlbumData(data)
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchAlbumCounts()
    }, []);

    const totalPhotos = albumData.reduce((sum, item) => sum + item.photos, 0);
    
    const totalStorage = storageData.reduce((sum, item) => sum + item.size, 0);

    const totalStorageGB = (totalStorage / 1024).toFixed(1);
    
    const getColorPair = (baseColor) => {
        const hex = baseColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const lighterR = Math.min(255, Math.floor(r + (255 - r) * 0.4));
        const lighterG = Math.min(255, Math.floor(g + (255 - g) * 0.4));
        const lighterB = Math.min(255, Math.floor(b + (255 - b) * 0.4));
        const lighterColor = `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;
        return {
            start: baseColor,
            end: lighterColor
        };
    };

    const getItemColor = (index) => {
        return BASE_COLORS[index % BASE_COLORS.length];
    };

    const getBarGradient = (index) => {
        const baseColor = getItemColor(index);
        return getColorPair(baseColor);
    };

    const WidgetWrapper = ({ title, children, icon, iconColor }) => (
        <div className={`${isDarkMode 
                ? 'bg-gray-900 border-gray-800 hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)]' 
                : 'bg-white border-gray-200 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)]'} 
            rounded-xl shadow-xl border overflow-hidden 
            transition-all duration-300 transform hover:-translate-y-2
            hover:border-blue-500 group h-auto`}>
            <div className={`p-4 flex items-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                {React.cloneElement(icon, { className: `text-${iconColor} stroke-2` })}
                <h3 className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">{title}</h3>
            </div>
            <div className={`px-4 py-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-auto max-h-[700px]`}>
                {children}
            </div>
        </div>
    );

    const renderGradients = () => (
        <defs>
            {BASE_COLORS.map((color, index) => {
                const gradient = getColorPair(color);
                return (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={gradient.start} stopOpacity={1}/>
                        <stop offset="100%" stopColor={gradient.end} stopOpacity={1}/>
                    </linearGradient>
                );
            })}
        </defs>
    );

    return (
        <div className={`flex flex-col gap-5 w-full h-full ${isDarkMode ? 'bg-[#20262E]' : 'bg-gray-100'} items-center overflow-auto py-5`}>
            <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 mb-2.5 hidden md:block">
                Dashboard
            </h1>

            <div className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                    <WidgetWrapper 
                        title="Photo Count Percentage" 
                        icon={<CheckCircle />}
                        iconColor="cyan-400"
                    >
                        <div className="mb-3">
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm uppercase tracking-wider`}>Total Photos</p>
                            <p className="text-4xl font-extrabold text-cyan-400">{totalPhotos}</p>
                        </div>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                {renderGradients()}
                                <Pie
                                    data={albumData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="photos"
                                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                >
                                    {albumData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={getItemColor(index)} 
                                        />
                                    ))}
                                </Pie>
                                <Legend 
                                    layout="vertical" 
                                    align="right" 
                                    verticalAlign="middle"
                                    iconSize={10}
                                    iconType="circle"
                                    wrapperStyle={{
                                        color: isDarkMode ? '#E2E8F0' : '#4A5568'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </WidgetWrapper>

                    <WidgetWrapper 
                        title="Album Storage Percentage" 
                        icon={<Database />}
                        iconColor="amber-400"
                    >
                        <div className="mb-3">
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm uppercase tracking-wider`}>Total Storage</p>
                            <p className="text-4xl font-extrabold text-amber-400">{totalStorageGB} GB</p>
                        </div>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                {renderGradients()}
                                <Pie
                                    data={storageData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="size"
                                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                >
                                    {storageData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={getItemColor(index)} 
                                        />
                                    ))}
                                </Pie>
                                <Legend 
                                    layout="vertical" 
                                    align="right" 
                                    verticalAlign="middle"
                                    iconSize={10}
                                    iconType="circle"
                                    wrapperStyle={{
                                        color: isDarkMode ? '#E2E8F0' : '#4A5568'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </WidgetWrapper>
                </div>

                <div className="flex flex-col gap-6">
                    <WidgetWrapper 
                        title="Photo Count by Album" 
                        icon={<BarChart3 />}
                        iconColor="pink-400"
                    >
                        <div className="mb-3">
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm uppercase tracking-wider`}>Photo Count Details</p>
                            <p className="text-4xl font-extrabold text-pink-400">{totalPhotos}</p>
                        </div>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart 
                                data={albumData} 
                                layout="vertical" 
                                margin={{ left: 50, right: 30 }}
                            >
                                {renderGradients()}
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={80} 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ 
                                        fill: isDarkMode ? '#A0AEC0' : '#4A5568',
                                        fontSize: 12 
                                    }}
                                />
                                <Bar 
                                    dataKey="photos" 
                                    barSize={20} 
                                    background={{ fill: isDarkMode ? "#374151" : "#EDF2F7" }}
                                    label={{ 
                                        position: "right", 
                                        fill: isDarkMode ? "#E2E8F0" : "#2D3748", 
                                        fontSize: 12 
                                    }} 
                                    className="transition-all duration-300 hover:opacity-80"
                                >
                                    {albumData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#gradient-${index % BASE_COLORS.length})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </WidgetWrapper>

                    <WidgetWrapper 
                        title="Album Storage Details" 
                        icon={<HardDrive />}
                        iconColor="teal-400"
                    >
                        <div className="mb-3">
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm uppercase tracking-wider`}>Used Storage</p>
                            <p className="text-4xl font-extrabold text-teal-400">{totalStorageGB} GB</p>
                        </div>
                        <div className="space-y-4 h-[320px]">
                            {storageData.map((item, index) => {
                                const barGradient = getBarGradient(index);
                                
                                return (
                                    <div key={`storage-${index}`} className="relative pt-1 group">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-teal-300' : 'text-gray-600 group-hover:text-teal-600'} transition-colors`}>
                                                {item.name}
                                            </div>
                                            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-teal-300' : 'text-gray-600 group-hover:text-teal-600'} transition-colors`}>
                                                {(item.size / 1024).toFixed(1)} GB
                                            </div>
                                        </div>
                                        <div className={`flex h-3 overflow-hidden rounded ${isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-200 group-hover:bg-gray-300'} transition-colors`}>
                                            <div 
                                                className="transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                                                style={{ 
                                                    width: `${item.percentage}%`,
                                                    background: `linear-gradient(to right, ${barGradient.start}, ${barGradient.end})`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className={`pt-6 mt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} py-4`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Đã sử dụng:</span>
                                    <span className="text-teal-400 font-bold">{totalStorageGB} GB / 5.0 GB</span>
                                </div>
                                <div className={`w-full h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mt-3 group-hover:bg-gray-600 transition-colors`}>
                                    <div 
                                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500 hover:shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
                                        style={{ width: `${Math.min(100, (totalStorage / (5 * 1024)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </WidgetWrapper>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;