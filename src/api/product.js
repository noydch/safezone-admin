import axios from "axios"
import ApiPath from "./apiPath"
import { message } from "antd";

const base64ToFile = (base64String, filename) => {
    let arr = base64String.split(",");
    let mime = arr[0].match(/:(.*?);/)[1]; // ดึงประเภท MIME (image/jpeg, image/png)
    let bstr = atob(arr[1]); // แปลง Base64 -> Binary
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
};




export const insertFoodApi = async (token, data) => {
    console.log(data);

    const headerConfig = {
        headers: {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    };

    const formData = new FormData();

    if (data?.image && data.image[0]?.url.startsWith("data:image")) {
        const file = base64ToFile(data.image[0].url, "upload.jpg"); // แปลง Base64 เป็นไฟล์
        formData.append("image", file);
    } else {
        console.error("Image is not a valid Base64 string", data.image);
        return false;
    }

    formData.append("name", data?.name);
    formData.append("categoryId", data?.categoryId);
    // formData.append("qty", data?.qty);
    formData.append("price", data?.price);

    try {
        const response = await axios.post(ApiPath.insertFood, formData, headerConfig);
        return response;
    } catch (error) {
        console.error("Upload Error:", error);
        return false;
    }
};

export const deleteFoodApi = async (id, imageUrl) => {
    try {
        const response = await axios.delete(`${ApiPath.deleteFood}/${id}`, {
            data: { imageUrl }
        },)
        // if (response) {
        //     message.success("ລົບລາຍການອາຫານສຳເລັດ!!!")
        // }
    } catch (error) {
        console.log(error);
    }
}



export const getFoodApi = async () => {
    return await axios.get(ApiPath.getFood)
}

export const updateFoodApi = async (token, id, data) => {
    const headerConfig = {
        headers: {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }

    if (data?.image && data.image[0]?.url.startsWith("data:image")) {
        const file = base64ToFile(data.image[0].url, "upload.jpg"); // แปลง Base64 เป็นไฟล์
        formData.append("image", file);
    } else {
        console.error("Image is not a valid Base64 string", data.image);
        return false;
    }

    const formData = new FormData()
    formData.append("name", data?.name);
    formData.append("categoryId", data?.categoryId);
    // formData.append("qty", data?.qty);
    formData.append("price", data?.price);

    try {
        const response = await axios.post(`${ApiPath.updateFood}/${id}`, formData, headerConfig);
        return response;
    } catch (error) {
        console.error("Upload Error:", error);
        return false;
    }
}




// Drink
export const insertDrinkApi = async (token, data) => {
    const headerConfig = {
        headers: {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    };

    const formData = new FormData();

    if (data?.image && data.image[0]?.url.startsWith("data:image")) {
        const file = base64ToFile(data.image[0].url, "upload.jpg"); // แปลง Base64 เป็นไฟล์
        formData.append("image", file);
    } else {
        console.error("Image is not a valid Base64 string", data.image);
        return false;
    }

    formData.append("name", data?.name);
    formData.append("categoryId", data?.categoryId);
    // formData.append("qty", data?.qty);
    formData.append("price", data?.price);

    try {
        const response = await axios.post(ApiPath.insertDrink, formData, headerConfig);
        return response;
    } catch (error) {
        console.error("Upload Error:", error);
        return false;
    }
};

export const deleteDrinkApi = async (id, imageUrl) => {
    console.log(id);

    try {
        const response = await axios.delete(`${ApiPath.deleteDrink}/${id}`, {
            data: { imageUrl }
        },)
        // if (response) {
        //     message.success("ລົບລາຍການອາຫານສຳເລັດ!!!")
        // }
    } catch (error) {
        console.log(error);
    }
}



export const getDrinkApi = async () => {
    return await axios.get(ApiPath.getDrink)
}

export const updateDrinkApi = async (token, id, data) => {
    const headerConfig = {
        headers: {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }

    if (data?.image && data.image[0]?.url.startsWith("data:image")) {
        const file = base64ToFile(data.image[0].url, "upload.jpg"); // แปลง Base64 เป็นไฟล์
        formData.append("image", file);
    } else {
        console.error("Image is not a valid Base64 string", data.image);
        return false;
    }

    const formData = new FormData()
    formData.append("name", data?.name);
    formData.append("categoryId", data?.categoryId);
    // formData.append("qty", data?.qty);
    formData.append("price", data?.price);

    try {
        const response = await axios.post(`${ApiPath.updateDrink}/${id}`, formData, headerConfig);
        return response;
    } catch (error) {
        console.error("Upload Error:", error);
        return false;
    }
}