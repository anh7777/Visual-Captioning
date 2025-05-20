import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setUser, deleteState, setMode } from "../redux/appSlice";
import { readUser, logout, refresh } from "../services/authService";
import UserRoutes from "./UserRoutes";
import IntroRoutes from "./IntroRoutes";
import AdminRoutes from "./AdminRoutes";
import Loader from "../components/Loader";

function AppRoutes() {
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const isInitializedRef = useRef(false);
  
  const silentRefresh = useCallback(async () => {
    try {
      const accessToken = await refresh();
      localStorage.setItem("at", accessToken);
      
      return accessToken;
    } catch (err) {
      console.error("Silent refresh failed:", err.message);
      return false;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      localStorage.removeItem("at");
      localStorage.removeItem("hasLoggedIn");
      dispatch(deleteState());
      navigate("/");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const initializeApp = async () => {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;
      
      try {
        const accessToken = localStorage.getItem("at");
        const hasLoggedIn = localStorage.getItem("hasLoggedIn");
        
        const savedMode = localStorage.getItem("mode") || "dark";
        dispatch(setMode(savedMode));

        if (!accessToken) {
          if (hasLoggedIn) {
            await silentRefresh();
          }
        } else {
          try {
            const userData = await readUser(accessToken);
            dispatch(setUser(userData));
            localStorage.setItem("hasLoggedIn", "true");
          } catch (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
              if (!(await silentRefresh())) {
                await handleLogout();
              }
            } else {
              throw error;
            }
          }
        }
      } catch (err) {
        console.error("Authentication error:", err.message);
        await handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const REFRESH_INTERVAL = 59 * 60 * 1000;
    const intervalId = setInterval(async () => {
      const newToken = await silentRefresh();
      if (newToken) {
        try {
          const userData = await readUser(newToken);
          dispatch(setUser(userData));
        } catch (err) {
          console.error("Failed to update user data after token refresh:", err);
        }
      }
    }, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [user, silentRefresh, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (user) {
    return user.role === "admin" ? <AdminRoutes /> : <UserRoutes />;
  }
  
  return <IntroRoutes />;
}

export default AppRoutes;