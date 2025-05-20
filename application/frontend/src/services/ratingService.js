import { API } from './config'

export async function createRating(formData, token) {
    console.log(formData);
    console.log(formData);
    try {
        await API.post('/rating/create', formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    } catch (error) {
        throw error
    }
}


export async function saveMedia(file, token) {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await API.post('/rating/save', formData, {
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