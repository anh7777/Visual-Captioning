import { API } from './config.js'

export async function fetchAllAlbums(token) {
    try {
        const response = await API.get('/album/read', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
}


export async function createAlbum(formData, token) {
    try {
        await API.post('/album/create', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (err) {
        throw err
    }
}


export async function updateAlbum(album, token) {
    try {
        const response = await API.patch('/album/update', album, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}


export async function deleteAlbums(albumIds, token) {
    const request = albumIds.map(albumId => ({ album_id: albumId }));
    try {
        await API.delete('/album/delete', {
            data: request,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (err) {
        throw err;
    }
}


export async function countAlbums(token) {
    try {
        const response = await API.get('/album/count', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = response.data;

        const totalPhotos = data.reduce((sum, album) => sum + album.count, 0);

        const formatted = data.map(album => ({
            name: album.album_name,
            photos: album.count,
            percentage: totalPhotos > 0 ? Number(((album.count / totalPhotos) * 100).toFixed(1)) : 0
        }));

        return formatted;
    } catch (err) {
        throw err
    }
}