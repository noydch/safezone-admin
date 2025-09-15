import axios from "axios";
import ApiPath from "./apiPath";

export const LoginApi = async (email, password) => {
    const data = { email, password }
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        const response = await axios.post(ApiPath.login, data, config)
        return response
    } catch (error) {
        console.log(error);
    }
}

