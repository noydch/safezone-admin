import axios from 'axios';
import ApiPath from './apiPath'; // Make sure ApiPath is imported


export const getUnitApi = async () => {
    try {
        return await axios.get(ApiPath.getAllUnit)
    } catch (error) {
        console.error("Error fetching units:", error);
        throw error;
    }
};

export const insetUnitApi = async (token, name) => {
    return await axios.post(ApiPath.createUnit, name, {
        headers: `Bearer ${token}`
    })
}

export const delUnitApi = async (token, id) => {
    return await axios.delete(`${ApiPath.deleteUnit}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateUnitApi = async (token, id, name) => {
    return await axios.put(`${ApiPath.updateUnit}/:${id}`, name, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}