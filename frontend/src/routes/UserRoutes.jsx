import { Routes, Route, Navigate } from 'react-router-dom'
import UserLayout from '../components/UserLayout';
import Uploading from '../pages/user/Uploading';
import Collection from '../pages/user/Collection';
import Media from '../pages/user/Media';

function UserRoutes() {
    return (
        <Routes>
            <Route path='/' element={<UserLayout />}>
                <Route index element={<Uploading />} />
                <Route path='/upload' element={<Uploading />} />
                <Route path='/history' element={<History />} />
                <Route path='/collection' element={<Collection />} />
                <Route path='/collection/:id' element={<Media />} />
                <Route path='/login' element={<Navigate to='/' />} />
                <Route path='/signup' element={<Navigate to='/' />} />
            </Route>
        </Routes>
    );
}

export default UserRoutes;