import axios from "axios"

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