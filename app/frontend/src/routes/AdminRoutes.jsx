import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users';
import Feedback from '../pages/admin/Feedback';
import { Navigate } from 'react-router-dom';


function AdminRoutes() {
    return (
        <Routes>
            <Route path='/' element={<AdminLayout />}>
                <Route index element={<Dashboard/>} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/users' element={<Users />} />
                <Route path='/feedback' element={<Feedback />} />
                <Route path='/login' element={<Navigate to='/' />} />
                <Route path='/signup' element={<Navigate to='/' />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;