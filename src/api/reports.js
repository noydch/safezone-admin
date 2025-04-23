import axios from "axios"
import ApiPath from "./apiPath"

export const reportFoodDrinkApi = async () => {
    return axios.get(ApiPath.reportFoodDrink)
}

export const reportOrderApi = async () => {
    return axios.get(ApiPath.reportOrder)
}

export const reportIncomeExprenseApi = async () => {
    return axios.get(ApiPath.reportIncomeExpense)
}