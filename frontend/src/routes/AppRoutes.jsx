import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { setUser, deleteState } from "../redux/appSlice";
import { fetchUserInfo } from "../services/userService";
import { logout, refresh } from '../services/authService';
import UserRoutes from './UserRoutes';
import IntroRoutes from './IntroRoutes';
import AdminRoutes from './AdminRoutes';
import Loader from "../components/Loader";

function AppRoutes() {
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    dispatch(deleteState());
    await logout();
    localStorage.removeItem('at');
  }, [dispatch]);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const accessToken = localStorage.getItem('at');
      if (!accessToken) {
        await handleLogout();
        return;
      }
      
      try {
        const userInfo = await fetchUserInfo(accessToken);
        dispatch(setUser(userInfo));
      } catch (error) {
        try {
          const newAccessToken = await refresh();
          localStorage.setItem('at', newAccessToken);
          const userInfo = await fetchUserInfo(newAccessToken);
          dispatch(setUser(userInfo));
        } catch (refreshError) {
          await handleLogout();
          window.location.reload();
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, handleLogout]);

  useEffect(() => {
    const accessToken = localStorage.getItem('at');
    if (accessToken) {
      fetchUserData();
    } else {
      handleLogout();
    }
  }, [fetchUserData, handleLogout]);

  if (!localStorage.getItem('at')) {
    return <IntroRoutes />;
  }

  if (isLoading || !user) {
    return <Loader />;
  }

  return user.role === 'admin' ? <AdminRoutes /> : <UserRoutes />;
}

export default AppRoutes;