import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { createAlbum } from "../../../services/albumService";
import { CloseOutlined } from "@ant-design/icons";


const Creation = ({ openCreation, setOpenCreation, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (formData) => {
        setLoading(true);
        try {
            await createAlbum(formData, localStorage.getItem('at'));
            setOpenCreation(false); 
            form.resetFields();
            onSuccess();
        } catch (err) {
            form.setFields([
                {
                    name: 'album_name',
                    errors: [err.response?.data?.detail || 'Có lỗi xảy ra khi tạo bộ sưu tập']
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .album-creation-custom-modal .ant-modal-content {
                    background-color: #1e293b;
                    color: #f8fafc;
                }
                .album-creation-custom-modal .ant-modal-header {
                    background-color: #1e293b;
                    border-bottom: none;
                }
                .album-creation-custom-modal .ant-modal-footer {
                    background-color: #1e293b;
                    border-top: none;
                }
                .album-creation-custom-modal .ant-rate-star:not(.ant-rate-star-full) .ant-rate-star-first,
                .album-creation-custom-modal .ant-rate-star:not(.ant-rate-star-full) .ant-rate-star-second {
                    color: #475569;
                }
                .album-creation-custom-modal .ant-rate-star-full .ant-rate-star-first,
                .album-creation-custom-modal .ant-rate-star-full .ant-rate-star-second {
                    color: #fbbf24;

                }
            `}</style>
            <Modal
                open={openCreation}
                onCancel={() => {
                    setOpenCreation(false)
                    form.resetFields()
                }}
                footer={null}
                centered
                width={500}
                closeIcon={<CloseOutlined className="!text-white hover:scale-110 transform hover:!text-red-500" />}
                className="album-creation-custom-modal"
            >
                <h2 className="text-center text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
                    Tạo mới bộ sưu tập
                </h2>
                
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                    requiredMark={false}
                >
                    <Form.Item
                        name="album_name" 
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên bộ sưu tập!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên bộ sưu tập"
                        />
                    </Form.Item>

                    <div className="flex justify-center mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={loading}
                            className="!bg-[#3A59D1]"
                        >
                            Tạo mới
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>

    );
}


export default Creation;