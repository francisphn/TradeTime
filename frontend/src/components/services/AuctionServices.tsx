import axios from "axios"
import {getCookie} from "./CookiesService";

export const fetchAllAuctions = async () => {
    return axios.get('http://localhost:4941/api/v1/auctions')
        .then(response => {
            return response
        }, error => {
            return error.response
        })
}

export const fetchAllCategories = async () => {
    return axios.get('http://localhost:4941/api/v1/auctions/categories')
        .then(response => {
            return response
        }, error => {
            return error.response
        })
}

export const fetchAuction = async(auctionId: string) => {
    return axios.get('http://localhost:4941/api/v1/auctions/' + auctionId + "/")
        .then(response => {
            return response
        }, error => {
            return error.response
        })
}

export const fetchAuctionHistory = async (auctionId: string) => {



    return axios.get('http://localhost:4941/api/v1/auctions/' + auctionId + "/bids")
        .then(response => {
            return response
        }, error => {
            return error.response
        })
}

export const userBidAuction = async (auctionId: string, bidAmount: number) => {

    const axiosConfig = {headers: {"X-Authorization": getCookie("userToken")}}

    return axios.post('http://localhost:4941/api/v1/auctions/' + auctionId + "/bids", {
        "amount": bidAmount
    }, axiosConfig)
        .then(response => {
            return response
        }, error => {
            return error.response
        })
}

export const userCreateAuction = async (title: string, description: string, categoryId: number, endDate: string, reserve: number) => {

    const axiosConfig = {headers: {"X-Authorization": getCookie("userToken")}}

    return axios.post('http://localhost:4941/api/v1/auctions/', {
        "title": title,
        "description": description,
        "categoryId": categoryId,
        "endDate": endDate,
        "reserve": reserve
    }, axiosConfig)
        .then(response => {
            return response
        }, error => {
            return error.response
        })

}
export const userUploadImageAuction = async (image: any, auctionId: string) => {
    const axiosPhotoConfig = {
        headers: {"content-type": image.type,
            "X-Authorization": getCookie("userToken")
        }
    }

    return await axios.put('http://localhost:4941/api/v1/auctions/'+ auctionId + '/image', image, axiosPhotoConfig)
        .then(response => {
            return response
        }, error => {
            return error.response.statusText
        })
}