import axios from "axios";

let axiosConfig = {
    headers: {
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept': 'Token',
        "Access-Control-Allow-Origin": "*",

    }
};

const register = async (firstName: string, lastName: string, email: string, password: string) => {


}

export default  register;