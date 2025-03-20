import { useState, useEffect } from 'react';
import { 
  Upload, 
  Button, 
  message, 
  Modal, 
  Rate, 
  Checkbox, 
  Drawer, 
  AutoComplete, 
  Input 
} from 'antd';
import { 
  UploadOutlined, 
  CopyOutlined, 
  StarOutlined, 
  SaveOutlined,
  SearchOutlined
} from '@ant-design/icons';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { generateCaption, uploadCaptionFile, saveCaptionDetails } from '../../services/captionService';
import { fetchAllCollections } from '../../services/collectionService';
import { saveMediaFile, saveMetadata } from '../../services/mediaService'

const { Dragger } = Upload;

function Uploading() {
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);

  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [rateModalData, setRateModalData] = useState({ isVisible: false, caption: "" });
  const [openSaveCard, setOpenSaveCard] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };

  const handleFileUpload = (file) => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setFileType(file.type.startsWith('image') ? 'image' : 'video');
    return false;
  };

  const handleGenerateCaption = async () => {
    if (!preview) {
      message.error("Vui lòng chọn một ảnh trước khi tạo caption.");
      return;
    }

    setIsLoading(true);
    try {
      const file = new File([await fetch(preview).then(res => res.blob())], "uploaded-image.jpg");
      const caption = await generateCaption(file, localStorage.getItem('at'));
      if (caption) {
        setCaptions([caption]);
      }
    } catch (error) {
      message.error("Failed to generate caption.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="w-full flex flex-col gap-6 items-center py-10">
      <Dragger 
        name="file"
        multiple={false}
        showUploadList={false}
        accept="image/*, video/*"
        beforeUpload={handleFileUpload}
        className="w-full max-w-2xl border-2 border-dashed border-purple-500 bg-purple-50 rounded-2xl p-6 text-center hover:bg-purple-100 hover:border-purple-600"
      >
        <p className="text-purple-600 text-4xl"><UploadOutlined /></p>
        <p className="text-lg font-semibold text-gray-700">Kéo & thả ảnh/video hoặc bấm để chọn</p>
      </Dragger>

      {preview && (
        fileType === 'image' ? (
          <img 
            src={preview} 
            alt="Uploaded Preview" 
            className="max-w-[500px] max-h-[500px] object-cover rounded-xl shadow-lg mt-4" 
          />
        ) : (
          <video 
            src={preview} 
            controls 
            className="max-w-[500px] max-h-[500px] rounded-lg shadow-lg mt-4" 
          />
        )
      )}

      <Button 
        className="!bg-gradient-to-r from-purple-500 to-pink-500 !text-white !font-bold !py-2 !px-6 !rounded-full !shadow-md !hover:scale-105"
        onClick={handleGenerateCaption}
        loading={isLoading}
      >
        Generate Captions
      </Button>

      {captions.length > 0 && (
        <div className="flex flex-col gap-2 w-full max-w-3xl bg-gray-100 rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold text-gray-700">Captions</h3>
          {captions.map((caption, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
              <span className="text-gray-800">{caption}</span>
              <div className='flex gap-0.5'>
                <button 
                  className="p-2 hover:scale-110" 
                  title='Lưu lại' 
                  onClick={() => {
                    setOpenSaveCard(true);
                    setSelectedCaption(caption);
                  }}
                >
                  <SaveOutlined />
                </button>
                <button 
                  className="p-2 hover:scale-110" 
                  title='Đánh giá' 
                  onClick={() => setRateModalData({ isVisible: true, caption })}
                >
                  <StarOutlined />
                </button>
                <button 
                  className="p-2 hover:scale-110" 
                  title='Copy' 
                  onClick={() => handleCopy(caption)}
                >
                  <CopyOutlined />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <RateCard 
        rateModalData={rateModalData} 
        setRateModalData={setRateModalData}
        preview={preview} 
      />
      <SaveCard 
        openSaveCard={openSaveCard} 
        setOpenSaveCard={setOpenSaveCard} 
        preview={preview} 
        caption={selectedCaption} 
        setSelectedCaption={setSelectedCaption}
      />
    </div>
  );
}

const RateCard = ({ rateModalData, setRateModalData, preview }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const ratingLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"];
  const [isLoading, setIsLoading] = useState(false);

  const handleRate = async () => {
    if (rating == 0) {
      message.error("Vui lòng đánh giá số sao.");
      return;
    }

    const formData = {
      original_caption: rateModalData.caption,  
      rate: rating,
      ...(feedback && { suggested_caption: feedback })
    };

    setIsLoading(true);
    try {
      const file = new File([await fetch(preview).then(res => res.blob())], "uploaded-image.jpg");
      const mediaUrl = await uploadCaptionFile(file, localStorage.getItem('at'));
      formData.media_url = mediaUrl;
      await saveCaptionDetails(formData, localStorage.getItem('at'));
      message.success("Đánh giá thành công!");
    } catch (error) {
      message.error("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal 
      open={rateModalData.isVisible}
      onCancel={() => {
        setRateModalData({ isVisible: false, caption: "" });
        setRating(0);
        setFeedback();
        setFeedback();
      }}
      footer={
        <Button 
          type="primary" 
          className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-lg text-white"
          onClick={handleRate}
          loading={isLoading}
          disabled={isLoading}
        >
          Đánh giá
        </Button>
      }
      width={750}
      title={
        <p className='text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500'>
          Chia sẻ đánh giá của bạn
        </p>
      }
    >
      <div className='flex flex-col gap-6 p-2.5'>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Bạn cảm thấy thế nào?</h3>
          <p className="text-sm text-gray-500">Hãy để lại đánh giá để giúp chúng tôi cải thiện dịch vụ!</p>
        </div>

        <div className="flex flex-col items-center">
          <Rate className="text-4xl text-yellow-400" onChange={setRating} value={rating} />
          {rating > 0 && <p className="mt-2 text-lg font-semibold text-blue-600">{ratingLabels[rating - 1]}</p>}
        </div>

        {rateModalData.caption && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Nội dung hiện tại</h3>
            <textarea 
              className="w-full p-3 border rounded-lg bg-gray-100 resize-none" 
              value={rateModalData.caption} 
              disabled 
            />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Bạn có đề xuất cải thiện không?</h3>
          <textarea 
            className="w-full p-3 border rounded-lg bg-purple-50 focus:ring-4 focus:ring-purple-400 outline-none resize-none" 
            placeholder="Nhập góp ý của bạn..." 
            value={feedback} 
            onChange={(e) => setFeedback(e.target.value)} 
          />
        </div>
      </div>
    </Modal>
  );
};

const SaveCard = ({ openSaveCard, setOpenSaveCard, preview, caption, setSelectedCaption }) => {
  const [allCollections, setAllCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mediaName, setMediaName] = useState();
  const [searchOptions, setSearchOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllCollections(localStorage.getItem('at'));
        setAllCollections(data);
        setFilteredCollections(data);

        const options = data.map(collection => ({
          value: collection.collection_name,
          label: collection.collection_name,
          id: collection.collection_id
        }));
        setSearchOptions(options);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    if (openSaveCard) {
      fetchData();
    }
  }, [openSaveCard]);

  const handleSearch = (value) => {
    setSearchValue(value);

    if (!value) {
      setFilteredCollections(allCollections);
      return;
    }

    const searchTerm = value.toLowerCase();
    const filtered = allCollections.filter(collection => 
      collection.collection_name.toLowerCase().includes(searchTerm)
    );

    setFilteredCollections(filtered);
  };

  const handleSelectCollection = (value, option) => {
    setSearchValue(value);
    setSelectedId(option.id);

    const selected = allCollections.filter(c => c.collection_id === option.id);
    if (selected.length > 0) {
      setFilteredCollections(selected);
    }
  };

  const handleSaveFile = async () => {
    if (!selectedId) {
      message.error("Vui lòng chọn bộ sưu tập.");
      return;
    }

    const formData = {
      collection_id: selectedId,
      media_type: 'image',
      caption: caption,
      ...(mediaName && { media_name: mediaName })
    };

    setIsLoading(true);
    try {
      const file = new File([await fetch(preview).then(res => res.blob())], "uploaded-image.jpg");
      const baseUrl = await saveMediaFile(file, localStorage.getItem('at'));
      formData.base_url = baseUrl;
      await saveMetadata(formData, localStorage.getItem('at'));
      message.success("Đã lưu thành công!");
    } catch (error) {
      message.error("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setMediaName();
      setSelectedId();
      setSearchValue('');
      setOpenSaveCard(false);
      setSelectedCaption();
    }
  };

  const resetAndCloseDrawer = () => {
    setOpenSaveCard(false);
    setSelectedCaption();
    setMediaName();
    setSelectedId();
    setSearchValue('');
  };

  return (
    <Drawer 
      title={
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text drop-shadow-lg">
          Lựa chọn bộ sưu tập
        </span>
      }
      open={openSaveCard}
      onClose={resetAndCloseDrawer}
      placement="right"
      className='bg-gray-900 text-white rounded-t-lg overflow-y-auto'
      width={650}
      extra={
        <Button 
          type="primary" 
          onClick={handleSaveFile} 
          loading={isLoading} 
          disabled={isLoading}
        >
          Save
        </Button>
      }
      closeIcon={<span className="text-black text-2xl font-bold hover:text-red-500 transition">×</span>}
    >
      <div className='flex flex-col gap-5 w-full h-full'>
        <Input
          placeholder='Nhập tên ảnh hoặc video'
          style={{width: '100%'}}
          onChange={(e) => setMediaName(e.target.value)}
          value={mediaName}
          allowClear
        />

        <AutoComplete
          value={searchValue}
          options={searchOptions}
          onChange={handleSearch}
          onSelect={handleSelectCollection}
          style={{width: '100%'}}
          placeholder="Tìm kiếm bộ sưu tập"
          allowClear
          filterOption={false}
          notFoundContent="Không tìm thấy bộ sưu tập nào"
        >
          <Input 
            suffix={<SearchOutlined />} 
            placeholder="Tìm kiếm bộ sưu tập" 
          />
        </AutoComplete>

        <Button 
          type="link" 
          className="text-blue-400 self-end" 
          onClick={() => {
            setSearchValue('');
            setFilteredCollections(allCollections);
          }}
        >
          Hiển thị tất cả
        </Button>

        <ImageList cols={3} gap={20} className='!p-4 mt-1.5'>
          {filteredCollections.map(({ collection_id, collection_name, thumbnail_url }) => (
            <ImageListItem 
              key={collection_id} 
              className={`relative cursor-pointer rounded-xl overflow-hidden transition-transform transform hover:scale-105 shadow-xl bg-gray-800 ${
                selectedId === collection_id ? 'ring-4 ring-blue-500' : 'opacity-90'
              }`}
              onClick={() => {
                setSelectedId(selectedId === collection_id ? undefined : collection_id);
              }}
            >
              <div className="bg-[#333333] p-1.5 rounded-2xl">                                
                <LazyLoadImage 
                  src={thumbnail_url}
                  className="h-35 object-cover rounded-xl"
                  placeholder={<img src='/placeholder-image.jpg' className='w-full h-48 object-contain rounded-xl' />}
                />
                <ImageListItemBar
                  title={collection_name}
                  position="below"
                  className='bg-gray-700 text-white rounded-b-xl text-center'
                />
              </div>
              <div className='absolute top-2 right-2'>
                <Checkbox checked={selectedId === collection_id} className='text-white' />
              </div>
            </ImageListItem>
          ))}
        </ImageList>

        {filteredCollections.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-gray-400">
            <p>Không tìm thấy bộ sưu tập nào</p>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default Uploading;