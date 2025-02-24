import { API } from '../core/config.js'

export async function fetchUserInfo(token) {
    try {
        const response = await API.get('/user/info', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}