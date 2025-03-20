import { API } from '../core/config.js'

export async function fetchAllCollections(token) {
    try {
        const response = await API.get('/collection/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createCollection(formData, token) {
    console.log(formData);
    try {
        await API.post('/collection/create/', formData,
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