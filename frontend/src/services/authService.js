import { API } from '../core/config.js'

export async function login(username, password) {
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await API.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (response.status == 200) {
            const { access_token } = response.data;
            return access_token;
        }
    } catch (err) {
        throw err;
    }
}

export async function signup(formData) {
    try {
        const response = await API.post('/auth/signup ', formData);
        return response
    } catch (error) {
        throw error
    }
}

export async function logout() {
    try {
        const response = await API.post('/auth/logout');
        return response
    } catch (error) {
        throw error;
    }
}

export async function logoutAll() {
    try {
        const response = await API.post('/auth/logout-all');
        return response
    } catch (error) {
        throw error;
    }
}

export async function refresh() {
    try {
        const response = await API.post('/auth/refresh');
        const { access_token } = response.data;
        return access_token;
    } catch (error) {
        throw error;
    }
}