import {Simulate} from "react-dom/test-utils";
import {useParams} from "react-router-dom";
import React from "react";
import axios from "axios";


const Login = () => {
    const id = useParams()

    const [userLogin, setUserLogin] = React.useState<userLogin>({email: "", password: ""})

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [userEmailAddress, setUserEmailAddress] = React.useState("")
    const [userPassword, setUserPassword] = React.useState("")

    const logIn = () => {

        setUserLogin({email: userEmailAddress, password: userPassword})

        axios.post('https://localhost:4941/api/v1/users/login', userLogin)
            .then(response => {
                setErrorFlag(false)
                setErrorMessage("")
            }, error => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })

        if (errorFlag) {
            alert(errorMessage)
        } else {
            alert("Success")
        }
    }

    const updateUserEmailAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmailAddress(event.target.value)
    }

    const updateUserPassword= (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserPassword(event.target.value)
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={logIn}>
                <label>Email address</label>
                <input type={"text"} value={userEmailAddress} onChange={updateUserEmailAddress}/>
                <label>Password</label>
                <input type={"text"} value={userPassword} onChange={updateUserPassword}/>
                <br/>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}

export default Login