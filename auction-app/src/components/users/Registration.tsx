import {useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import User from "./User";

const Registration = () => {
    const id = useParams()

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")


    // const [user, setUser] = React.useState<User> ({user_id: 0, first_name: "", last_name: "", password:"", profile_photo: ""})

    const [userId, setUserId] = React.useState(0)
    const [userFirstName, setUserFirstName] = React.useState("")
    const [userLastName, setUserLastName] = React.useState("")
    const [userPassword, setUserPassword] = React.useState("")
    const [userPhoto, setUserPhoto] = React.useState("")

    const checkFilled = () => {
        if (userId != 0 && userFirstName != "" && userLastName != "" && userPassword != "") {
            return true
        } else {
            return false
        }
    }

    const addUser = () => {
        if (checkFilled()) {
                alert("Good")
            axios.post('https://localhost:4191/api/users', {"username": username})
                        .then(r => {
                                setErrorFlag(false)
                                setErrorMessage("")
                            },
                                error => {
                                    setErrorFlag(true)
                                    setErrorMessage(error.toString())
                                })
        } else {
            alert("One of the fields is missing!")
        }
    }

    const updateUserIdState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(0) // event.target.value
    }

    const updateUserFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserFirstName(event.target.value)
    }

    const updateUserLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
        set
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={addUser}>
                <input type="text" value={userId} onChange={updateUserIdState}/>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}

export default Registration