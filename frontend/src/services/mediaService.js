import { API } from "../core/config";

export async function fetchAllMediaOfCollection(collection_id, token) {
    try {
        const response = await API.get(`/media/collection`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { collection_id }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function saveMediaFile(file, token) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await API.post('media/save-file', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.base_url;
    } catch (error) {
        throw error;
    }
}


export async function saveMetadata(formData, token) {
    try {
        const response = await API.post('media/save-metadata', formData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function fetchMediaCaption(media_id, token) {
    try {
        const response = await API.get(`/media/caption`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { media_id }
        });
        return response.data.caption;
    } catch (error) {
        throw error;
    }
}