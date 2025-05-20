import { API } from './config.js'

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
        await API.post('/auth/signup ', formData);
    } catch (err) {
        throw err;
    }
}

export async function logout() {
    try {
        await API.post('/auth/logout');
    } catch (err) {
        throw err;
    }
}

export async function refresh() {
    try {
        const response = await API.post('/auth/refresh');
        return response.data.access_token;
    } catch (error) {
        throw error;
    }
}

export async function readUser(token) {
    try {
        const response = await API.get('/auth/info', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteAccount(token) {
    try {
        await API.delete('/auth/delete', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        throw err;
    }
}


export async function updateAccount(formData, token) {
    try {
        await API.patch('/auth/update', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        throw err;
    }
}