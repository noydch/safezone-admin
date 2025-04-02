import axios from "axios"
import ApiPath from "./apiPath"

export const getEmployeeApi = async () => {
    return await axios.get(ApiPath.getEmployee)
}