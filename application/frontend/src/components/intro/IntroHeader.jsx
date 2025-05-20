import { faComputer } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "antd"
import { useNavigate } from "react-router-dom"
import { useState } from "react"


function IntroHeader() {
    const navigate = useNavigate()
    const [activePage, setActivePage] = useState('')

    const handleClickPage = (newPage) => {
        setActivePage(newPage)
        navigate(newPage)
    }

    const navItems = [
        { title: "Product", path: "product" },
        { title: "About Us", path: "about-us" },
        { title: "Contact", path: "contact" },
    ]
    
    return (
        <div className='flex items-center p-0.5 h-full w-full pl-1.5 pr-1.5 bg-gradient-to-r from-blue-50 via-white to-blue-50 animate-fade-in'>
            <div 
                className="flex items-center cursor-pointer select-none group"
                onClick={() => navigate('/')}
            >
                <div className='text-xl p-1.5 rounded-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-200/50'>
                    <FontAwesomeIcon icon={faComputer} className="text-xl"/>
                </div>
                <span className='text-[16px] font-semibold text-blacktransition-all duration-300 group-hover:scale-105'>
                    CaptionAI
                </span>
            </div>

            <div className='flex items-center ml-auto gap-5'>
                {navItems.map((item) => (
                    <NavItem 
                        key={item.path}
                        title={item.title}
                        path={item.path}
                        active={activePage === item.path}
                        onClick={() => handleClickPage(item.path)}
                    />
                ))}

                <Button 
                    className='w-[60px] border-blue-200 hover:!text-blue-600 hover:!border-blue-300 hover:!bg-blue-50 hover:!shadow-md hover:!shadow-blue-100/50 transition-all duration-300'
                    onClick={() => handleClickPage('signup')}
                >
                    Sign up
                </Button>
                <Button 
                    type="primary" 
                    className='w-[70px] !bg-gradient-to-r !from-blue-500 !to-blue-600 hover:!shadow-lg hover:!shadow-blue-200/50 !border-none !text-white !font-semibold transition-all duration-300'
                    onClick={() => handleClickPage('login')}
                >
                    Login
                </Button>
            </div>
        </div>
    )
}

const NavItem = ({ title, active, onClick }) => {
    return (
        <span 
            className={`relative cursor-pointer select-none font-semibold transition-all duration-300 box-border not-md:hidden ${
                active ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500 hover:scale-105'
            }`}
            onClick={onClick}
        >
            {title}
            {active && (
                <div className="absolute bottom-[3px] left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            )}
        </span>
    )
}


export default IntroHeader