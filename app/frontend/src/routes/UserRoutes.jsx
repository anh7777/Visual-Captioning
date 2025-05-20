import { Routes, Route, Navigate } from 'react-router-dom'
import UserLayout from '../components/user/UserLayout';
import Upload from '../pages/user/upload/Upload';
import Album from '../pages/user/album/Album';
import Media from '../pages/user/media/Media';
import Dashboard from '../pages/user/Dashboard';
import Support from '../pages/user/Support';


function UserRoutes() {
    return (
        <Routes>
            <Route path='/' element={<UserLayout />}>
                <Route index element={<Upload />} />
                <Route path='/upload' element={<Upload />} />
                <Route path='/history' element={<History />} />
                <Route path='/album' element={<Album />} />
                <Route path='/album/:albumId' element={<Media />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/support' element={<Support />} />
                <Route path='/login' element={<Navigate to='/' />} />
                <Route path='/signup' element={<Navigate to='/' />} />
            </Route>
        </Routes>
    );
}

export default UserRoutes;