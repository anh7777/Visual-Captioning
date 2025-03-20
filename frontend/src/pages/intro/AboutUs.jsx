import { Carousel } from 'antd';

function AboutUs() {
    const images = ["/image.png", "/image.png", "/image.png", "/image.png"]
    console.log(window.innerWidth)

    return (
        <div className="flex flex-col items-center w-full">
                <div className="w-full  max-w-[1250px]  min-w-[850px]">
                    <Carousel 
                        autoplay
                        autoplaySpeed={4000} 
                        draggable={true}
                        pauseOnHover={false} 
                        pauseOnFocus={false}
                        
                    >
                        {images.map((src, index) => (
                            <div key={index}>
                                <img src={src} alt={`Slide ${index + 1}`} className='rounded-2xl'/>
                            </div>
                        ))}
                    </Carousel>
            </div>


            <div className="mt-6">
                <h2 className="text-3xl font-bold text-red-500">Về chúng tôi</h2>
                <p className="mt-2 text-lg text-gray-700 max-w-[800px]">
                    Chúng tôi là một đội nhóm về Trí tuệ nhân tạo (AI), Xử lý ngôn ngữ tự nhiên (NLP) 
                    và Thị giác máy tính (Computer Vision), đam mê xây dựng các sản phẩm giúp tối ưu hóa nội dung số.
                </p>
            </div>
        </div>
    );
}

export default AboutUs;
