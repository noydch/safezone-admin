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
    // static insertBooking = `${baseUrl}/reservation` // Remove or comment out old path
    static createReservation = `${baseUrl}/createReservation`
    static getReservations = `${baseUrl}/getReservations`
    static getReservationById = `${baseUrl}/getReservation` // Note: ID needs to be appended dynamically
    static updateReservationStatus = `${baseUrl}/updateReservationStatus` // Note: ID needs to be appended dynamically
    static deleteReservation = `${baseUrl}/deleteReservation` // Note: ID needs to be appended dynamically 

    // customer
    static createCustomer = `${baseUrl}/createCustomer`
    static getCustomers = `${baseUrl}/getCustomers`
    static getCustomerById = `${baseUrl}/getCustomer` // Note: ID needs to be appended dynamically
    static updateCustomer = `${baseUrl}/updateCustomer` // Note: ID needs to be appended dynamically
    static deleteCustomer = `${baseUrl}/deleteCustomer` // Note: ID needs to be appended dynamically

    // supplier
    static createSupplier = `${baseUrl}/createSupplier`
    static getSuppliers = `${baseUrl}/getSuppliers`
    static getSupplierById = `${baseUrl}/getSupplier` // Note: ID needs to be appended dynamically
    static updateSupplier = `${baseUrl}/updateSupplier` // Note: ID needs to be appended dynamically
    static deleteSupplier = `${baseUrl}/deleteSupplier` // Note: ID needs to be appended dynamically

    // purchase order
    static createPurchaseOrder = `${baseUrl}/createPurchaseOrder`
    static getPurchaseOrders = `${baseUrl}/getPurchaseOrders`
    static getPurchaseOrderById = `${baseUrl}/getPurchaseOrder` // Note: ID needs to be appended dynamically
    static updatePurchaseOrderStatus = `${baseUrl}/updatePurchaseOrderStatus` // Note: ID needs to be appended dynamically
    static deletePurchaseOrder = `${baseUrl}/deletePurchaseOrder` // Note: ID needs to be appended dynamically

    // purchase order detail
    static getPurchaseOrderDetails = `${baseUrl}/getPurchaseOrderDetails`
    static getDetailsByOrderId = `${baseUrl}/getDetailsByOrderId` // Note: purchaseOrderId needs to be appended dynamically
    static getPurchaseOrderDetailById = `${baseUrl}/getPurchaseOrderDetail` // Note: detail ID needs to be appended dynamically
    static updatePurchaseOrderDetail = `${baseUrl}/updatePurchaseOrderDetail` // Note: detail ID needs to be appended dynamically
    static deletePurchaseOrderDetail = `${baseUrl}/deletePurchaseOrderDetail` // Note: detail ID needs to be appended dynamically

    // cart
    static addCart = `${baseUrl}/addCart`
    static getCart = `${baseUrl}/getCart`
    static updateCart = `${baseUrl}/updateCart`
    static removeCart = `${baseUrl}/delCartItem`

    // order
    static createOrder = `${baseUrl}/createOrder`
    static getOrders = `${baseUrl}/getOrders`
    static getOrderById = `${baseUrl}/getOrder`
    static deleteOrder = `${baseUrl}/deleteOrder`
}