import React, { useState } from 'react'
import { 
	Upload as UploadAntd, 
	Button, 
	message, 
	Tooltip
} from 'antd'
import { 
	UploadOutlined, 
	CopyOutlined, 
	StarOutlined, 
	SaveOutlined,
	CloseOutlined
} from '@ant-design/icons'
import { generateCaption } from '../../../services/captionService'
import SaveDrawer from './SaveDrawer'
import RateModal from './RateModal';
import { useSelector } from 'react-redux'

const SAMPLE_IMAGES = [
	"https://upload.wikimedia.org/wikipedia/commons/1/19/B%C3%A1nh_m%C3%AC.jpg",
	"https://images.unsplash.com/photo-1615228402326-7adf9a257f2b",
	"https://upload.wikimedia.org/wikipedia/commons/1/10/Pepperoni_pizza.jpeg",
	"https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg",
	"https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
]

function Upload() {
	const isDarkMode = useSelector((state) => state.app.mode) === 'dark';

	const [currentFile, setCurrentFile] = useState()
	const [preview, setPreview] = useState()
	
	const [caption, setCaption] = useState({label: '', caption: '', ingredients: [], instructions: []})
	const [isLoading, setIsLoading] = useState(false)
	
	const [openSaveCard, setOpenSaveCard] = useState(false)
	const [hasSaved, setHasSaved] = useState(false)
	
	const [isRateModalVisible, setIsRateModalVisible] = useState(false)
	const [hasRated, setHasRated] = useState(false)
	const [ratedCaption, setRatedCaption] = useState("")

	const handleFileUpload = (file) => {
		if (!file.type.startsWith('image/')) {
			message.error('Please upload only image files!')
			return false
		}
		URL.revokeObjectURL(preview)
		setPreview(URL.createObjectURL(file))
		setCurrentFile(file)
		setCaption('')
		return false 
	}

	const handleSampleImageSelect = async (imageUrl) => {
		setPreview(imageUrl)
		setCaption('')
		const blob = await fetch(imageUrl).then(res => res.blob());
		const file = new File([blob], "uploaded-image.jpg", { type: blob.type });
		setCurrentFile(file)
	}

	const handleGenerateCaption = async () => {
		if (preview) {
			setIsLoading(true)
			try {
				const blob = await fetch(preview).then(res => res.blob());
				const file = new File([blob], "uploaded-image", { type: blob.type });
				const captionResponse = await generateCaption(file, localStorage.getItem('at'))
				setCaption(captionResponse);
			} catch (error) {
				message.error("Failed to generate caption.")
				console.error(error.message);
			} finally {
				setIsLoading(false);
			}
			return
		} else {
			message.error("Please select an image before generating a caption.")
		}
	}

	const handleCopy = (text) => {
		navigator.clipboard.writeText(text)
		message.success('Copied to clipboard!')
	}

	const openRateModal = () => {
		setIsRateModalVisible(true)
		setRatedCaption(caption)
	}

	const handleOpenSaveDrawer = () => {
		setOpenSaveCard(true)
	}

	const handleCloseImage = () => {
		if (isLoading) {
			message.error('Caption generation in progress. Please try again later.')
		} else {
			setPreview(null)
			setCaption('')
			setHasRated(false)
			setHasSaved(false)
		}
	}

	return (
		<div className={`flex flex-col gap-5 w-full h-full items-center overflow-auto py-5 not-md:px-[10px]`}>
			<h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2.5 hidden md:block">
				Caption Generator
			</h1>

			{!preview && <div className="flex not-md:hidden justify-center gap-4 ">
				{SAMPLE_IMAGES.map((img, index) => (
					<Tooltip key={index} title="Select sample image">
						<img 
						src={img} 
						alt={`Sample ${index + 1}`} 
						className={`w-24 h-24 object-cover rounded-xl cursor-pointer transition-all duration-300 
							hover:scale-110 hover:shadow-2xl hover:rotate-6 
							border-2 border-transparent ${isDarkMode ? 'hover:border-cyan-400' : 'hover:border-cyan-600'}`}
						onClick={() => handleSampleImageSelect(img)}
						/>
					</Tooltip>
				))}
			</div>}
		
			{!preview && <div className='max-w-4xl w-[80%] not-md:h-16'>
				<UploadAntd.Dragger 
					name="file"
					multiple={false}
					showUploadList={false}
					accept="image/*"
					beforeUpload={handleFileUpload}
					className={`border-dashed transition-all duration-300 group ${
						isDarkMode 
							? 'border-gray-500 bg-gray-800 hover:bg-gray-700 hover:border-cyan-500' 
							: 'border-gray-300 bg-white hover:bg-gray-50 hover:border-cyan-500'
					}`}
				>
					<div className={`absolute inset-0 bg-gradient-to-r ${
						isDarkMode 
							? 'from-cyan-900 to-purple-900' 
							: 'from-cyan-100 to-purple-100'
					} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
					<p className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} md:text-4xl text-xl mb-4 relative z-10`}>
						<UploadOutlined />
					</p>
					<p className={`not-md:hidden text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} relative z-10`}>
						Drag & drop an image or click to select
					</p>
				</UploadAntd.Dragger>
			</div>}


			{preview && (
				<div className="flex justify-center md:p-2.5 p-8 relative md:mb-2.5">
					<img 
						src={preview} 
						alt="Uploaded Preview" 
						className="md:max-w-[800px] max-h-[450px] object-cover rounded-xl shadow-lg" 
					/>
					<button
						className="absolute top-5 right-5 md:top-0 md:right-0 bg-yellow-50 text-red-400 rounded-full px-1 p-0.5 hover:scale-110 transition-transform duration-200"
						onClick={handleCloseImage}
					>
						<CloseOutlined className="text-base" />
					</button>
				</div>
			)}

			{!caption.caption && <div className="flex justify-center">
				<Button 
					className={`!bg-gradient-to-r ${
						isDarkMode 
							? 'from-cyan-600 to-purple-600' 
							: 'from-cyan-500 to-purple-500'
					} !text-white !font-bold !py-2 !px-6 !rounded-full 
						!shadow-lg !hover:shadow-2xl !transform hover:-translate-y-1 !transition-all !duration-300`}
					onClick={handleGenerateCaption}
					loading={isLoading}
				>
				Generate Caption
				</Button>
			</div>}

			{caption.caption && <div className={`w-full max-w-4xl rounded-xl p-6 shadow-xl border not-md:p-3 ${
				isDarkMode 
					? 'bg-gray-900 border-gray-800' 
					: 'bg-white border-gray-200'
			}`}>
				<div className="mb-6 not-md:mb-2.5 rounded-lg overflow-hidden text-left">
					<div className={`p-4 not-md:px-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
						<h3 className="text-[22px] not-md:text-[18px] font-bold text-pink-500">Caption</h3>
					</div>
					<div className={`px-4 rounded-b-lg not-md:px-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
						<p className={`text-lg not-md:text-[16px] font-medium break-all text-left ${
							isDarkMode ? 'text-gray-200' : 'text-gray-700'
						}`}>{caption.caption}</p>
						<div className="flex justify-end mt-2 pb-4">
							<Tooltip title="Copy Title">
								<button 
								className={`transition-colors duration-300 transform hover:scale-125 text-[18px] not-md:text-[16px] ${
									isDarkMode ? 'text-pink-300 hover:text-pink-400' : 'text-pink-500 hover:text-pink-600'
								}`}
								onClick={() => handleCopy(caption.caption)}
								>
								<CopyOutlined />
								</button>
							</Tooltip>
						</div>
					</div>
				</div>


				{caption?.name && <div className="mb-6 not-md:mb-2.5 rounded-lg overflow-hidden text-left">
					<div className={`p-4 not-md:px-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
						<h3 className="text-[22px] not-md:text-[18px] font-bold text-cyan-500">Name</h3>
					</div>
					<div className={`px-4 rounded-b-lg not-md:px-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
						<p className={`text-lg not-md:text-[16px] font-medium break-all text-left ${
							isDarkMode ? 'text-gray-200' : 'text-gray-700'
						}`}>{caption.name}</p>
						<div className="flex justify-end mt-2 pb-4">
							<Tooltip title="Copy Title">
								<button 
								className={`transition-colors duration-300 transform hover:scale-125 text-[18px] not-md:text-[16px] ${
									isDarkMode ? 'text-pink-300 hover:text-pink-400' : 'text-pink-500 hover:text-pink-600'
								}`}
								onClick={() => handleCopy(caption.name)}
								>
								<CopyOutlined />
								</button>
							</Tooltip>
						</div>
					</div>
				</div>}


				{caption.ingredients.length > 0 && 
				<div className="mb-6 not-md:mb-2.5 rounded-lg overflow-hidden text-left">
					<div className={`p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
						<h3 className="text-[22px] not-md:text-[18px] font-bold text-teal-500">Ingredients</h3>
					</div>
					<div className={`px-4 not-md:px-3 rounded-b-lg text-left ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
						<ul className={`list-disc list-inside space-y-1 text-lg not-md:text-[14px] ${
							isDarkMode ? 'text-amber-300' : 'text-amber-600'
						}`}>  
							{caption.ingredients.map((item, idx) => (
								<li key={idx} className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>{item}</li>
							))}
						</ul>            
						<div className="flex justify-end mt-2 pb-4">
							<Tooltip title="Copy Ingredients">
							<button 
								className={`transition-colors duration-300 transform hover:scale-125 text-[18px] not-md:text-[16px] ${
									isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
								}`}
								onClick={() => handleCopy(caption.ingredients.join(', '))}
							>
								<CopyOutlined />
							</button>
							</Tooltip>
						</div>
					</div>
				</div>
				}

				{caption.instructions.length > 0 && 
					<div className="mb-6 rounded-lg overflow-hidden text-left">
						<div className={`p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
							<h3 className="text-[22px] not-md:text-[18px] font-bold text-purple-500">Instructions</h3>
						</div>
						<div className={`px-4 not-md:px-3 rounded-b-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
							<ol className="list-decimal list-inside space-y-2 text-lg not-md:text-[14px]">
								{caption.instructions.map((step, idx) => (
									<li key={idx} className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>{step}</li>
								))}
							</ol>
							<div className="flex justify-end mt-2 pb-4">
								<Tooltip title="Copy Instructions">
								<button 
									className={`transition-colors duration-300 transform hover:scale-125 text-[18px] not-md:text-[16px] ${
										isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'
									}`}
									onClick={() => handleCopy(caption.instructions.join('\n'))}
								>
									<CopyOutlined />
								</button>
								</Tooltip>
							</div>
						</div>
					</div>
				}

				<div className='flex justify-center gap-8 md:mt-4'>
					<Tooltip title="Save">
						<button 
							className={`flex flex-col items-center transition-all duration-300 transform hover:scale-110 ${
								isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
							}`}
							onClick={handleOpenSaveDrawer}
						>
							<div className={`p-2 not-md:px-1.5 not-md:py-1 rounded-full mb-1 ${
								isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
							}`}>
								<SaveOutlined className="text-xl not-md:text-[12px]" />
							</div>
							<span className="text-xs">Save</span>
						</button>
					</Tooltip>
					
					<Tooltip title="Rate">
						<button 
							className={`flex flex-col items-center transition-all duration-300 transform hover:scale-110 ${
								isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'
							}`}
							onClick={openRateModal}
						>
							<div className={`p-2 not-md:px-1.5 not-md:py-1 rounded-full mb-1 ${
								isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'
							}`}>
								<StarOutlined className="text-xl not-md:text-[12px]" />
							</div>
							<span className="text-xs">Rate</span>
						</button>
					</Tooltip>
				</div>
			</div>}


			<RateModal
				isVisible={isRateModalVisible}
				setIsVisible={setIsRateModalVisible}
				hasRated={hasRated}
				setHasRated={setHasRated}
				caption={ratedCaption}
				file={currentFile}
			/>

			<SaveDrawer
				openSaveCard={openSaveCard} 
				setOpenSaveCard={setOpenSaveCard} 
				caption={caption}
				file={currentFile}
				hasSaved={hasSaved}
				setHasSaved={setHasSaved}
			/>
		</div>
	)
}


export default Upload