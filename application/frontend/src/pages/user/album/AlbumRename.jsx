import { updateAlbum } from "../../../services/albumService"
import { Modal, Form, message, Input, Button } from 'antd'
import { useState } from "react";


const Rename = ({
    openRename,
    setOpenRename,
    selectedAlbums,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    const handleRename = async (formData) => {
        try {
            setIsLoading(true)
            const album = {
                album_id: selectedAlbums[0],
                album_name: formData.album_name
            }
            await updateAlbum(album, localStorage.getItem('at'))
            message.success('Rename the album successfully.')
            form.resetFields() 
            setOpenRename(false)
            onSuccess()
        } catch (err) {
            form.setFields([
                {
                    name: 'album_name',
                    errors: ['Có lỗi xảy ra khi đổi tên album này']
                }
            ]);
            console.log(err.message);
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
            border-bottom: 1px solid #334155;
        }
        .custom-modal .ant-modal-footer {
            background-color: #1e293b;
            border-top: 1px solid #334155;
        }
        .custom-modal .ant-modal-close-x {
            
        }
        .custom-modal .ant-rate-star:not(.ant-rate-star-full) .ant-rate-star-first,
        .custom-modal .ant-rate-star:not(.ant-rate-star-full) .ant-rate-star-second {
            color: #475569;
        }
        .custom-modal .ant-rate-star-full .ant-rate-star-first,
        .custom-modal .ant-rate-star-full .ant-rate-star-second {
            color: #fbbf24;
        }
    `

    return (
        <>
            <style>{modalStyles}</style>
            <Modal
                open={openRename}
                onCancel={() => {
                    setOpenRename(false)
                    form.resetFields() 
                }}
                footer={null}
                centered
                width={500}
                className="custom-modal"
            >
                <h2 className="text-center text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
                    Rename Album
                </h2>
                
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleRename}
                    requiredMark={false}
                >
                    <Form.Item
                        name="album_name" 
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên mới!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên mới"
                        />
                    </Form.Item>

                    <div className="flex justify-center mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            disabled={isLoading}
                            className="!bg-[#3A59D1]"
                        >
                            Rename
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    )
}


export default Rename