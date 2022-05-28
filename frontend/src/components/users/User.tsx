import {useNavigate} from "react-router-dom";
import React from "react";
import {deleteCookie, isThereCookie} from "../services/CookiesService";
import {getUserFromBackend} from "../services/UserAccountServices";
import Button from "@mui/material/Button";

const User = () => {

    const navigator = useNavigate()

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [userData, setUserData] = React.useState<userReturnWithEmail>({
        firstName: "",
        lastName: "",
        email: ""
    })

    React.useEffect(() => {
        if (!isThereCookie()) {
            navigator('/login')
        }
        handleLoadUserDetails().then(r => setUserData(r.data))
    }, [])

    const handleLoadUserDetails = async () => {
        const result = await getUserFromBackend()
        console.log(result)
        return result
    }

    const handleLogOut = () => {
        deleteCookie()
        navigator('/login')
    }

    return (

                <div>
                    <p>Hi!</p>
                    <h1>{userData.firstName}</h1>
                    <h1>{userData.lastName}</h1>
                    <h1>{userData.email}</h1>

                    <Button variant="outlined" onClick={handleLogOut}>Log out</Button>
                </div>
    )
}

export default User;