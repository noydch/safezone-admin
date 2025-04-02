const baseUrl = 'http://localhost:5050/api';


export default class ApiPath {
    static login = `${baseUrl}/login`
    static getEmployee = `${baseUrl}/getEmployee`

    // category
    static insertCategory = `${baseUrl}/category`
    static getCategory = `${baseUrl}/getCategory`
    static delCategory = `${baseUrl}/delCategory`
    static updateCategory = `${baseUrl}/updateCategory`

    // food
    static insertFood = `${baseUrl}/createFood`
    static getFood = `${baseUrl}/getFood`
    static deleteFood = `${baseUrl}/delFood`
    static updateFood = `${baseUrl}/updateFood`

    // drink
    static insertDrink = `${baseUrl}/createDrink`
    static getDrink = `${baseUrl}/getDrink`
    static deleteDrink = `${baseUrl}/delDrink`
    static updateDrink = `${baseUrl}/updateDrink`

    // image
    static insertImage = `${baseUrl}/image`
    static delImage = `${baseUrl}/delImage`

    // table
    static insertTable = `${baseUrl}/insertTable`
    static delTable = `${baseUrl}/delTable`
    static updateTable = `${baseUrl}/updateTable`
    static getTable = `${baseUrl}/getTable`

    // reservation
    static insertBooking = `${baseUrl}/reservation`

    // cart
    static addCart = `${baseUrl}/addCart`
    static getCart = `${baseUrl}/getCart`
    static updateCart = `${baseUrl}/updateCart`
    static removeCart = `${baseUrl}/delCartItem`
}