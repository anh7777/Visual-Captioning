import { API } from './config.js';

export async function fetchAllMediasOfAlbum(albumId, token) {
    try {
        const response = await API.get('/media/read-album', {
            params: { album_id: albumId },
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function createMediaMetadata(formData, token) {
    try {
        await API.post('/media/create', formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        throw error;
    }
}


export async function addMediaFile(file, token) {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await API.post('/media/add', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error
    }
}


export async function deleteMedias(medias, token) {
    const request = medias.map(mediaId => ({ media_id: mediaId }));
    try {
        await API.delete('/media/delete', {
            data: request,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (err) {
        throw err
    }
}


export async function updateMedia(media, token) {
    try {
        await API.patch('/media/update', media, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (err) {
        throw err
    }
}


export async function readMedia(mediaId, token) {
    try {
        const response = await API.get('/media/read', {
            params: { media_id: mediaId },
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err) {
        throw err;
    }
}
