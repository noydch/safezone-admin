import axios from "axios";

const instance = axios.create({
    baseURL: "/api", // แก้ตาม backend ของคุณ
});

export default instance;
