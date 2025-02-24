import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser, setIsLoading, deleteState } from "../redux/appSlice";
import { fetchUserInfo } from "../services/userService";
import { logout, refresh } from '../services/authService';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import UserRoutes from '../routes/UserRoutes';
import AdminRoutes from '../routes/AdminRoutes';
import Login from "../pages/Login";
import Signup from "../pages/Signup";

function AppRoutes() {
    const isLoading = useSelector((state) => state.app.isLoading);
    const user = useSelector((state) => state.app.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogout = async () => {
            dispatch(deleteState());
            await logout();
            localStorage.removeItem('at');
        }

        const fetchUserData = async () => {
            try {
                const userInfo = await fetchUserInfo(localStorage.getItem('at'));
                dispatch(setUser(userInfo));
            } catch {
                try {
                    const accessToken = await refresh();
                    localStorage.setItem('at', accessToken);
                    const userInfor = await fetchUserInfo(localStorage.getItem('at'));
                    dispatch(setUser(userInfor));
                } catch {
                    await handleLogout();
                    localStorage.removeItem('at');
                    window.location.reload();
                }
            } finally {
                dispatch(setIsLoading(false));
            }
        }

        if (localStorage.getItem('at')) {
            fetchUserData();
        } else {
            handleLogout();
        }
    }, [dispatch]);

    if (isLoading) return <Spin indicator={<LoadingOutlined />} />;

    if (!localStorage.getItem('at')) {
        return (
            <Routes>
                <Route path="/" element={<Navigate to='/login' />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path="/*" element={<Navigate to='/' />} />
            </Routes>
        );
    }

    return (
        <>{user?.role === 'admin' ? <AdminRoutes /> : <UserRoutes />}</>
    );
}

export default AppRoutes;
