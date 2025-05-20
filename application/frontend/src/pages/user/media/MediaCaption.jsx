import { useEffect } from 'react'
import { useState } from 'react'
import { Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { readMedia } from '../../../services/mediaService'
import { useSelector } from 'react-redux'


const Caption = ({ openCaption, setOpenCaption, selectedMediaId, setSelectedMediaId }) => {
    const isDarkMode = useSelector((state) => state.app.mode) === 'dark';
    const [mediaInfo, setMediaInfo] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {      
        const fetchMedia = async () => {
            try {
                setIsLoading(true)
                const mediaResponse = await readMedia(selectedMediaId, localStorage.getItem('at'))
                console.log(mediaResponse);
                setMediaInfo(mediaResponse)
            } catch (err) {
                console.log(err.message);
            } finally {
                setIsLoading(false)
            }
        }
        fetchMedia()
    }, [selectedMediaId])

    const handleCancel = () => {
        setOpenCaption(false)
        setSelectedMediaId()
    }

    const modalStyles = `
        .caption-modal .ant-modal-content {
            background-color: ${isDarkMode ? '#0f172a' : '#ffffff'};
            color: ${isDarkMode ? '#f1f5f9' : '#334155'};
            border-radius: 16px;
        }
        .caption-modal .ant-modal-header {
            background-color: ${isDarkMode ? '#0f172a' : '#ffffff'};
            border-bottom: none;
        }
        .caption-modal .ant-modal-body {
            max-height: 70vh;
            overflow-y: auto;
        }
        .caption-modal .ant-modal-content .ant-modal-body {
            scrollbar-width: none;
        }
    `

    return (
        <>
            <style>{modalStyles}</style>
            <Modal
                open={openCaption}
                onCancel={handleCancel}
                footer={null}
                centered
                className="caption-modal"
                width={700}
                title={<p className='text-cyan-400 font-semibold text-2xl text-center'>{mediaInfo?.media_name}</p>}
                closeIcon={
                    <CloseOutlined
                        style={{
                            fontSize: '20px',
                            color: isDarkMode ? '#f1f5f9' : '#64748b',
                            opacity: 0.7,
                            cursor: 'pointer',
                            transition: 'color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#ff4757'}
                        onMouseOut={(e) => e.currentTarget.style.color = isDarkMode ? '#f1f5f9' : '#64748b'}
                    />
                }
                loading={isLoading}
            >
                {mediaInfo && <div className="space-y-6 p-4">
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'} p-4 rounded-lg shadow-md`}>
                        <h3 className="text-lg font-semibold text-pink-300 mb-2">Caption</h3>
                        <p className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} leading-relaxed`}>
                            {mediaInfo?.caption}
                        </p>
                    </div>

                    {mediaInfo.name && 
                        <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'} p-4 rounded-lg shadow-md`}>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Name</h3>
                            <p className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} leading-relaxed`}>
                                {mediaInfo?.name}
                            </p>
                        </div>
                    }

                    {mediaInfo.ingredients.length > 0 && 
                        <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'} p-4 rounded-lg shadow-md`}>
                            <h3 className="text-lg font-semibold text-teal-400 mb-2">Ingredients</h3>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                {mediaInfo.ingredients.map((item, idx) => (
                                    <li key={idx} className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    }

                    {mediaInfo.instructions.length > 0 && 
                        <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'} p-4 rounded-lg shadow-md`}>
                            <h3 className="text-lg font-semibold text-purple-300 mb-2">Instructions</h3>
                            <ol className="list-decimal list-inside space-y-2 pl-2">
                                {mediaInfo.instructions.map((step, idx) => (
                                    <li key={idx} className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    }
                </div>}
            </Modal>
        </>
    )
}

export default Caption