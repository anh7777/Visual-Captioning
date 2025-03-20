import { API } from '../core/config.js';

export async function generateCaption(file, token) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await API.post('caption/generate', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.caption;
    } catch (error) {
        throw error;
    }
}

export async function addCaption(formData, token) {
    console.log(formData);
    try {
        await API.post('/caption/add/', formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (err) {
        throw err;
    }
}

export async function uploadCaptionFile(file, token) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await API.post('caption/save-file', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.media_url;
    } catch (error) {
        throw error;
    }
}


export async function saveCaptionDetails(formData, token) {
    try {
        const response = await API.post('caption/save-metadata', formData, {
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


