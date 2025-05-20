import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Input, message, Spin } from 'antd';
import { PlusCircleOutlined, LoadingOutlined, SelectOutlined} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import EmptyState from '../../../components/EmptyState';
import IconButton from '@mui/material/IconButton'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import { fetchAllAlbums } from '../../../services/albumService'
import Creation from './AlbumCreation'
import Rename from './AlbumRename'
import Delete from './AlbumDelete';
import { useSelector } from "react-redux"


function Album() {
    const isDarkMode = useSelector((state) => state.app.mode) === 'dark';
    const [columns, setColumns] = useState(3);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [albums, setAlbums] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);

    const [searchValue, setSearchValue] = useState('');

    const [openCreation, setOpenCreation] = useState(false);

    const [activeSelect, setActiveSelect] = useState(false)
    const [selectedAlbums, setSelectedAlbums] = useState([]);

    const [openRename, setOpenRename] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 550) {
                setColumns(1);
            } else if (window.innerWidth > 550 && window.innerWidth <= 1024) {
                setColumns(2);
            } else if (window.innerWidth > 1024 && window.innerWidth <= 1200) {
                setColumns(3);
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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchAllAlbums(localStorage.getItem('at'));
                setAlbums(data);
                setFilteredAlbums(data);
            } catch (error) {
                console.error('Error fetching albums:', error);
                message.error('Không thể tải dữ liệu bộ sưu tập');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (value) => {
        const searchTerm = value.toLowerCase().trim();
        if (!searchTerm) {
            setFilteredAlbums(albums);
            return;
        }
        
        const results = albums.filter(item => 
            item.album_name.toLowerCase().includes(searchTerm)
        );
        setFilteredAlbums(results);
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleClickSelect = () => {
        if (activeSelect) {
            setSelectedAlbums([])
        }
        setActiveSelect(!activeSelect)
    }

    const handleClickAlbum = (albumId) => {
        if (activeSelect) {
            if (selectedAlbums.includes(albumId)) {
                setSelectedAlbums(prev => prev.filter(id => id !== albumId));
            } else {
                setSelectedAlbums(prev => [...prev, albumId])
            }
        } else {
            navigate(`/album/${albumId}`)
        }
    }

    const successCreation = async () => {
        fetchAllAlbums(localStorage.getItem('at')).then(data => {
            setAlbums(data)
            setFilteredAlbums(data)
            setActiveSelect(false)
            setSelectedAlbums([])
        })
        .catch(err => console.error(err.message))
    }

    const successRename = async () => {
        fetchAllAlbums(localStorage.getItem('at')).then(data => {
            setAlbums(data)
            setFilteredAlbums(data) 
            setActiveSelect(false)           
            setSelectedAlbums([])
        })
        .catch(err => console.error(err.message))
    }

    const successDelete = async () => {
        fetchAllAlbums(localStorage.getItem('at')).then(data => {
            setAlbums(data)
            setFilteredAlbums(data) 
            setActiveSelect(false)           
            setSelectedAlbums([])
        })
        .catch(err => console.error(err.message))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center w-full h-full relative'>
            <div className='w-full max-w-[1860px] flex items-center gap-2.5 p-2'>
                <Input.Search
                    value={searchValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    enterButton
                    placeholder='Tìm kiếm bộ sưu tập'
                    allowClear={false}
                    style={{ width: '100%' }}
                />
                <div 
                    className="cursor-pointer bg-blue-500 text-white py-1.5 px-2.5 rounded-2xl flex gap-1.5 items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out transform hover:bg-blue-400"
                    onClick={() => setOpenCreation(true)}
                >
                    <PlusCircleOutlined />
                    <span>Tạo mới</span>
                </div>

                <div 
                    className={`cursor-pointer py-1.5 px-2.5 w-[85px] rounded-2xl flex gap-1.5 items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out transform
                        ${activeSelect ? 'bg-red-500 hover:bg-red-400' : 'bg-blue-500 hover:bg-blue-400'}
                        text-white`}
                    onClick={handleClickSelect}
                >
                    <SelectOutlined />
                    <span>{activeSelect ? 'Hủy' : 'Chọn'}</span>
                </div>
            </div>

            <div className={`w-full h-full max-w-[1860px] p-2.5 overflow-auto ${activeSelect ? 'pb-[58px]' : ''}`}>
                {filteredAlbums.length > 0 ? (
                    <ImageList cols={columns} gap={20}>
                        {filteredAlbums.map(({album_id, album_name, thumbnail_url}) => (
                            <ImageListItem key={album_id}>
                                <div className="flex items-center justify-center p-2.5 rounded-2xl h-[250px] w-full">  
                                    <LazyLoadImage
                                        src={thumbnail_url}
                                        className='h-full object-cover rounded-xl w-full'
                                    />
                                    <ImageListItemBar
                                        sx={{
                                            borderRadius: '15px',
                                            height: '100%',
                                            width: '100%',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                        }}
                                        title={<p className={`text-center w-full caret-transparent ${activeSelect ? 'pr-[16px]' : ''}`}>{album_name}</p>}  
                                        actionIcon={
                                            activeSelect && <IconButton
                                                sx={{ color: 'white', position: 'absolute', top: 0, right: 0 }}
                                            >
                                                {selectedAlbums.includes(album_id) ? <CheckCircleOutlineOutlinedIcon /> : <CircleOutlinedIcon/>}
                                            </IconButton>
                                        }
                                        onClick={() => handleClickAlbum(album_id)}
                                    />
                                </div>
                            </ImageListItem>
                        ))}
                    </ImageList>
                ) : (
                    <EmptyState />
                )}       
            </div>

            {activeSelect && (
                <div
                    className={`
                    absolute bottom-0 w-full h-[48px] flex items-center gap-8 justify-center 
                    ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800'}
                    `}
                >
                    <button
                    className={`
                        flex flex-col items-center gap-[3px] transition-colors duration-200 mt-[6px]
                        ${selectedAlbums.length != 1 
                        ? '!cursor-default opacity-50 ' + (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                        : isDarkMode 
                            ? 'hover:text-yellow-400' 
                            : 'hover:text-yellow-600'
                        }
                    `}
                    disabled={selectedAlbums.length != 1}
                    onClick={() => setOpenRename(true)}
                    >
                    <FontAwesomeIcon icon={faPen} className='text-[17px]' />
                    <span className='text-xs'>Rename</span>
                    </button>

                    <button
                    className={`
                        flex flex-col items-center gap-[3px] transition-colors duration-200 mt-[6px]
                        ${selectedAlbums.length == 0 
                        ? '!cursor-default opacity-50 ' + (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                        : isDarkMode 
                            ? 'hover:text-rose-400' 
                            : 'hover:text-red-500'
                        }
                    `}
                    disabled={selectedAlbums.length == 0}
                    onClick={() => setOpenDelete(true)}
                    >
                    <FontAwesomeIcon icon={faTrash} className='text-[17px]' />
                    <span className='text-xs'>Delete</span>
                    </button>
                </div>
                )}


            <Creation
                openCreation={openCreation} 
                setOpenCreation={setOpenCreation} 
                onSuccess={successCreation}
            />

            <Rename
                openRename={openRename}
                setOpenRename={setOpenRename}
                selectedAlbums={selectedAlbums}
                onSuccess={successRename}
            />

            <Delete
                openDelete={openDelete}
                setOpenDelete={setOpenDelete}
                selectedAlbums={selectedAlbums}
                onSuccess={successDelete}
            />
        </div>
    );
}


export default Album;
