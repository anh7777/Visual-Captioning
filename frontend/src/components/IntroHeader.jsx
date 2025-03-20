import { faComputer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function IntroHeader() {
    const navigate = useNavigate()
    
    return (
        <div className='flex items-center p-0.5 h-full w-full pl-1.5 pr-1.5'>
            <div 
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={() => navigate('/')}
            >
                <FontAwesomeIcon icon={faComputer} className="text-xl"/>
                <span className='text-[16px]'>CaptionAI</span>
            </div>

            <div className='flex items-center ml-auto gap-5'>
                <span 
                    className='cursor-pointer select-none'
                    onClick={() => navigate('/product')}
                >Product</span>
                <span 
                    className='cursor-pointer select-none'
                    onClick={() => navigate('/about-us')}
                >About Us</span>
                <span 
                    className='cursor-pointer select-none'
                    onClick={() => navigate('/contact')}
                >Contact</span>
                <Button 
                    className='w-[60px]'
                    onClick={() => navigate('/signup')}
                >Sign up</Button>
                <Button 
                    type="primary" 
                    className='w-[70px]'
                    onClick={() => navigate('/login')}
                >Login</Button>

            </div>
        </div>
    )
}

export default IntroHeader;