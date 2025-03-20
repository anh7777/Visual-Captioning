import { faBell, faUser, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from '../services/authService';
import { deleteState } from "../redux/appSlice";

function UserHeader() {
    const fullName = useSelector((state) => state.app.user)?.full_name;

    return (
        <div className="flex items-center p-0.5 h-full w-full px-2.5">    
            <div className="flex items-center ml-auto gap-5">
                <FontAwesomeIcon 
                    icon={faBell} 
                    className="text-[20px] aspect-square cursor-pointer p-1.5 rounded-full hover:bg-gray-300 transition"
                />
                <Popover content={<AvatarContent fullName={fullName} />} trigger="click" styles={{ body: {padding: 0} }}>
                    <img src="/avatar.png" className="h-[35px] rounded-full cursor-pointer  "/>
                </Popover>  
            </div>
        </div>
    );
}

const AvatarContent = ({ fullName }) => {
    const items = [
        { icon: faUser, label: "Account"},
        { icon: faCog, label: "Settings",},
        { icon: faSignOutAlt, label: "Logout", isLogout: true }
    ];

    const dispatch = useDispatch();

    const handleLogout = async () => {
        dispatch(deleteState());
        await logout();
        localStorage.removeItem('at');
        window.location.reload();
    }

    return (
        <div className="w-48 bg-white shadow-md rounded-lg p-1">
            <div className="p-3 text-center font-semibold text-gray-800 text-[16px]">
                {fullName}
            </div>

            <div className="flex flex-col">
                {items.map(({ icon, label, isLogout }) => (
                    <button 
                        key={label}
                        className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition cursor-pointer rounded-lg
                                    ${isLogout ? "text-red-500 hover:bg-red-100" : ""}`}
                        onClick={isLogout ? handleLogout : () => {}}
                    >
                        <FontAwesomeIcon icon={icon} className={`"text-gray-600" ${isLogout ? "text-red-500 hover:bg-red-100" : ""}`}/>
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default UserHeader;
