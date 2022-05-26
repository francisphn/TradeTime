import axios from "axios";

const register = async (firstName: string, lastName: string, email: string, password: string) => {
    return await axios.post('https://localhost:4941/api/v1/users/register',
        {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
    )
        .then(response => {
            return response.status
        }, error => {
            return error.response.statusText
        })
}

export default register;