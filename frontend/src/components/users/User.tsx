import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect} from "react";
import axios from "axios";
import {ThemeProvider} from "@mui/material";
import {isThereCookie} from "../services/CookiesService";
import {getUserFromBackend} from "../services/UserAccountServices";

const User = () => {

    const navigator = useNavigate()

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [userData, setUserData] = React.useState("")

    React.useEffect(() => {
        if (!isThereCookie()) {
            navigator('/login')
        }
    })

    const handleLoadUserDetails = async () => {
        const userData = await getUserFromBackend()
        return (<h1>{userData.data}</h1>)

    }

    return (
            <div>
                <h1>About you</h1>
                {handleLoadUserDetails()}
            </div>
    )
}

export default User;