import { Routes, Route } from 'react-router-dom'
import Home from '../pages/admin/Home';
import { Navigate } from 'react-router-dom';

function AdminRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Navigate to='/' />} />
            <Route path='/signup' element={<Navigate to='/' />} />
        </Routes>
    );
}

export default AdminRoutes;