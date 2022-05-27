import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {register} from '../services/UserAccountServices'

import {Alert, AlertTitle} from "@mui/material";
import {useNavigate} from "react-router-dom";

import axios from "axios";



const theme = createTheme()

const Input = styled('input')({
    display: 'none',
});

export default function EditUser() {

    const navigator = useNavigate()

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [profileImageFile, setProfileImageFile] = React.useState("")
    const [isFilePicked, setIsFilePicked] = React.useState(false)

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()


        const data = new FormData(event.currentTarget)

        const firstName = data.get('firstName')
        const lastName = data.get('lastName')
        const email = data.get('email')
        const password = data.get('password')

        if (firstName === null || lastName === null || email === null || password === null) {
            setErrorFlag(false)
            setErrorMessage("One of the fields is blank!")
        } else {
            const registerMe = await register(firstName.toString(), lastName.toString(), email.toString(), password.toString())
            if (registerMe != 201) {
                setErrorFlag(true)
                setErrorMessage(registerMe)
            } else {
                setErrorFlag(false)
                setErrorMessage("")
                navigator('/home')
            }
        }



    }

    const handleSubmitProfilePhoto = (event: any) => {
        setProfileImageFile(event.target.files[0])
        setIsFilePicked(true);

        axios.put('http://localhost:4941/api/v1/users/1/image', {

        })
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">

                <CssBaseline/>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',}} />
                <Typography component="h1" variant="h5">Edit your profile</Typography>

                {errorFlag && <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}



                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus

                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"

                            />
                        </Grid>
                    </Grid>

                    <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" type="file" onChange={handleSubmitProfilePhoto} />
                        <Button variant="contained" component="span" fullWidth sx={{ mt: 3, mb: 2 }}>
                            Upload profile photo (optional)
                        </Button>
                    </label>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}

                    >
                        Confirm details
                    </Button>
                    <Grid container justifyContent="flex-end">

                    </Grid>
                </Box>

            </Container>

        </ThemeProvider>

    );
}