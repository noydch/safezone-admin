import axios from "axios"
import ApiPath from "./apiPath"

export const comfirmImport = async (token, id) => {
    return axios.post(ApiPath.comfirmImport, id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}