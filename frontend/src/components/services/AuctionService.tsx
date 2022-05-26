import axios from "axios"

const fetchAllAuctions = async () => {
    return axios.get('http://localhost:4941/api/v1/auctions')
        .then(response => {
            return response.data
        }, error => {
            return error.statusText
        })
}

export default fetchAllAuctions;