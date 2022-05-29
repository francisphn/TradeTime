import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import {
    editUser,
    getUserAvatar,
    getUserFromBackend,
    register,
    resetPassword,
    setAvatar
} from '../services/UserAccountServices'

import {Alert, AlertTitle} from "@mui/material";
import {useNavigate} from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import {getCookie, isThereCookie} from "../services/CookiesService";
import Avatar from "@mui/material/Avatar";


const theme = createTheme()

const Input = styled('input')({
    display: 'none',
});

export default function EditUser() {

    const navigator = useNavigate()

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")


    const [errorAuthorisationFlag, setErrorAuthorisationFlag] = React.useState(false)
    const [errorAuthorisationMessage, setErrorAuthorisationMessage] = React.useState("")


    const [profileImageFile, setProfileImageFile] = React.useState()
    const [isFilePicked, setIsFilePicked] = React.useState(false)
    const [preview, setPreview] = React.useState("")

    const [userData, setUserData] = React.useState<userReturnWithEmail>({
        firstName: "",
        lastName: "",
        email: ""
    })

    React.useEffect(() => {
        if (!isThereCookie()) {
            navigator('/login')
        }
        handleLoadUserDetails().then(r => {
            setUserData(r.data)
        })

        if (!profileImageFile) {
            setPreview("http://localhost:4941/api/v1/users/"+ getCookie('userId') + "/image")
            return
        }

        const objectUrl = URL.createObjectURL(profileImageFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)


    }, [profileImageFile, userData])

    const handleLoadUserDetails = async () => {
        const response = await getUserFromBackend()
        if (response.status === 404) {
            setErrorAuthorisationFlag(true)
            setErrorAuthorisationMessage("Something's wrong.")
        }
        return response
    }

    const handleLoadAvatar = async () => {
        return await getUserAvatar(getCookie('userId'))
    }

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()


        const data = new FormData(event.currentTarget)

        const dataToSend = {
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "email": userData.email
        }

        const firstName = data.get('firstName')
        const lastName = data.get('lastName')
        const email = data.get('email')

        const currentPassword = data.get('current-password')
        const newPassword = data.get('password')

        if (!(firstName === "" || firstName === null)) {
            dataToSend.firstName = firstName.toString()
        }
        if (!(lastName === "" || lastName === null)) {
            dataToSend.lastName = lastName.toString()
        }
        if (!(email === "" || email === null)) {
            dataToSend.email = email.toString()
        }

        const editMe = await editUser(dataToSend.firstName, dataToSend.lastName, dataToSend.email)

        if (editMe.status != 200) {
            setErrorFlag(true)
            setErrorMessage(editMe)
        } else {
            setErrorFlag(false)
            setErrorMessage("")

            if (isFilePicked) {
                const photoMe = await setAvatar(profileImageFile)
                console.log(photoMe)
                if (photoMe.status === 200 || photoMe.status === 201) {
                    setErrorFlag(false)
                    setErrorMessage("")
                } else {
                    setErrorFlag(true)
                    setErrorMessage(photoMe)
                }
            }

            if ((currentPassword === "" || currentPassword === null) && (newPassword === "" || newPassword === null)) {
                navigator('/user')
            } else if (currentPassword === "" || currentPassword === null || newPassword === "" || newPassword === null) {
                setErrorFlag(true)
                setErrorMessage("Either your current password or new password field is blank.")
            } else {
                const resetMyPassword = await resetPassword(currentPassword.toString(), newPassword.toString())

                if (resetMyPassword.status != 200) {
                    setErrorFlag(true)
                    setErrorMessage(resetMyPassword.statusText)
                } else {
                    setErrorFlag(false)
                    setErrorMessage("")
                    navigator('/user')
                }
            }
        }
    }

    const handleSubmitProfilePhoto = (event: any) => {
        setProfileImageFile(event.target.files[0])
        setIsFilePicked(true);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">

                {errorAuthorisationFlag && <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorAuthorisationMessage}</Alert>}


                {!errorAuthorisationFlag &&

                    <>

                        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',}}/>

                        <Box sx={{marginBottom: 4}}>
                            {errorFlag && <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorMessage}
                            </Alert>}
                        </Box>

                        <Box>
                            <Avatar
                                alt="Remy Sharp"
                                src={preview}
                                sx={{marginBottom: 3, width: 56, height: 56}}
                            />

                            <Typography component="h1" variant="h5">Edit your profile</Typography>

                            <label htmlFor="contained-button-file">
                                <Input accept="image/*" id="contained-button-file" type="file"
                                       onChange={handleSubmitProfilePhoto}/>
                                <Button variant="outlined" component="span" fullWidth sx={{mt: 3, mb: 2}}>
                                    Edit my profile photo
                                </Button>
                            </label>

                        </Box>


                        <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        fullWidth
                                        id="firstName"
                                        label="First name"
                                        autoFocus
                                        defaultValue={userData.firstName}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="lastName"
                                        label="Last name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        defaultValue={userData.lastName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        label="Email address"
                                        name="email"
                                        defaultValue={userData.email}
                                        autoComplete="email"


                                    />
                                </Grid>


                                <Grid item xs={12}>

                                    <Alert severity="info" sx={{marginTop: 3, marginBottom: 2}}>If you need to reset
                                        your password, enter it here. Otherwise, feel free to skip this section.</Alert>

                                    <TextField
                                        fullWidth
                                        name="current-password"
                                        label="Current password"
                                        type="password"
                                        id="current-password"
                                        autoComplete="new-password"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        label="New password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                    />
                                </Grid>

                            </Grid>


                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 5, mb: 2}} endIcon={<SendIcon/>}
                            >
                                Confirm details
                            </Button>
                            <Grid container justifyContent="flex-end">

                            </Grid>
                        </Box>


                    </>

                }



            </Container>

        </ThemeProvider>

    );
}