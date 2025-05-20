import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/intro/Home";
import Login from '../pages/intro/Login';
import Signup from '../pages/intro/Signup';
import IntroLayout from "../components/intro/IntroLayout";
import Product from "../pages/intro/Product";
import AboutUs from "../pages/intro/AboutUs";
import Contact from "../pages/intro/Contact";


function IntroRoutes() {
    return (
        <Routes>
            <Route path="/" element={<IntroLayout />} >
                <Route index element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/product' element={<Product />} />
                <Route path='/about-us' element={<AboutUs />} />
                <Route path='/contact' element={<Contact />} />
                <Route path="/*" element={<Navigate to='/' />} />
            </Route>

        </Routes>
    );
}

export default IntroRoutes;