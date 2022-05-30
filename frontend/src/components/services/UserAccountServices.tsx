import axios from "axios";
import {getCookie} from "./CookiesService";

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
    return await axios.post('http://localhost:4941/api/v1/users/register',
        {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password
    })
        .then(response => {
            return response
        }, error => {
            return error.response.statusText
        })
}

export const login = async (email: string, password: string) => {
    return await axios.post('http://localhost:4941/api/v1/users/login',
        {
            "email": email,
            "password": password
        }).then(respose => {
            return respose
    }, error => {
            return error.response.statusText
    })
}

export const setAvatar = async (image: any) => {

    const axiosPhotoConfig = {
        headers: {"content-type": image.type,
            "X-Authorization": getCookie("userToken")
        }
    }

    return await axios.put('http://localhost:4941/api/v1/users/'+ getCookie("userId") + '/image', image, axiosPhotoConfig)
        .then(response => {
            return response
        }, error => {
            return error.response.statusText
        })
}

export const getUserFromBackend = async () => {

    const axiosConfig = {headers: {"X-Authorization": getCookie("userToken")}}

    return await axios.get('http://localhost:4941/api/v1/users/'+ getCookie("userId"), axiosConfig)
        .then(response => {
            return response
        }, error => {
            return error.response.statusText
        })
}

export const getRelaxedUserFromBackend = async () => {

    return await axios.get('http://localhost:4941/api/v1/users/'+ getCookie("userId"))
        .then(response => {
            return response
        }, error => {
            return error.response.statusText
        })
}

export const editUser = async (firstName: string, lastName: string, email: string) => {

    const axiosConfig = {headers: {"X-Authorization": getCookie("userToken")}}

    return await axios.patch('http://localhost:4941/api/v1/users/'+ getCookie("userId"),
        {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
        } ,axiosConfig)
        .then(response => {
            return response
        }, error => {
            return error.response.statusText
        })
}

export const resetPassword = async (currentPassword: string, newPassword: string) => {

    const axiosConfig = {headers: {"X-Authorization": getCookie("userToken")}}

    return await axios.patch('http://localhost:4941/api/v1/users/'+ getCookie("userId"),
        {
            "currentPassword": currentPassword,
            "password": newPassword
        } ,axiosConfig)
        .then(response => {
            return response
        }, error => {
            return error.response
        })

}

export const getUserAvatar = async (id: string) => {
    return await axios.get('http://localhost:4941/api/v1/users/'+ getCookie("userId") + '/image')
        .then(response => {
            return response
        }, error => {
        return error.response.statusText
    })
}

