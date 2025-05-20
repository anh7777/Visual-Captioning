import { deleteMedias } from "../../../services/mediaService"
import { Modal, message } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"

const Delete = ({ openDelete, setOpenDelete, selectedMedias, onSuccess }) => {
    const isDarkMode = useSelector((state) => state.app.mode) === 'dark';
    
    const [isLoading, setIsLoading] = useState(false)

    const handleDeleteMedias = async () => {
        try {
            setIsLoading(true)
            await deleteMedias(selectedMedias, localStorage.getItem('at'))
            message.success('Deleted medias successfully.')
            setOpenDelete(false)
            onSuccess()
        } catch (err) {
            message.error('Failed to delete album. Please try again.')
            console.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const modalStyles = `
        .custom-modal .ant-modal-content {
            background-color: #1e293b;
            color: #f8fafc;
        }
        .custom-modal .ant-modal-header {
            background-color: #1e293b;
            border-bottom: none !important;
        }
        .custom-modal .ant-modal-footer {
            background-color: #1e293b;
            border: none !important;
        }
        .custom-modal .ant-rate-star:not(.ant-rate-star-full) .ant-rate-star-first,
        .custom-modal .ant-rate-star:not(.ant-rate-star-full) .ant-rate-star-second {
            color: #475569;
        }
        .custom-modal .ant-rate-star-full .ant-rate-star-first,
        .custom-modal .ant-rate-star-full .ant-rate-star-second {
            color: #fbbf24;
        }

        .custom-modal .ant-modal-close {
            display: none !important;
        }
    `

    return (
        <>
            <style>{modalStyles}</style>
            <Modal
                open={openDelete}
                onCancel={() => setOpenDelete(false)}
                onOk={handleDeleteMedias}
                confirmLoading={isLoading}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
                centered
                title={<h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
                    Delete Media
                </h2>}
                className="custom-modal"
            >
                <p>
                    Are you sure you want to delete{" "}
                    <strong>{selectedMedias.length}</strong> media{selectedMedias.length > 1 ? "s" : ""}?
                </p>
            </Modal>
        </>
    )
}

export default Delete
