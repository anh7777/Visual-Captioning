import { API } from './config.js'

export async function generateCaption(file, token) {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
        const result = {}
        const response1 = await API.post('model/caption', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        result.caption = response1.data.caption

        const response2 = await API.post('model/label', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        const label = response2.data.label
        result.label = label

        if (label === 'food') {
            const response3 = await API.post('model/recipe', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
            result.name = response3.data.name
            result.ingredients = response3.data.ingredients;
            result.instructions = response3.data.instructions;
        } else {
            result.ingredients = []
            result.instructions = []
        }
        return result
    } catch (err) {
        throw err
    }
}


export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }