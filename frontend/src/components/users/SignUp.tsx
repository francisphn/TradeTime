import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import register from '../services/UserAccountServices'

import axios from "axios";



const theme = createTheme()

export default function SignUp() {

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [userFirstName, setUserFirstName] = React.useState("")
    const [userLastName, setUserLastName] = React.useState("")
    const [userEmailAddress, setUserEmailAddress] = React.useState("")
    const [userPassword, setUserPassword] = React.useState("")
    const [userPhoto, setUserPhoto] = React.useState("")

    const updateUserFirstName = (event: {target: {value: React.SetStateAction<string>}}) => {
        setUserFirstName(event.target.value)
    }

    const updateUserLastName = (event: {target: {value: React.SetStateAction<string>}}) => {
        setUserFirstName(event.target.value)
    }

    const updateUserEmailAddress = (event: {target: {value: React.SetStateAction<string>}}) => {
        setUserEmailAddress(event.target.value)
    }

    const updateUserPassword= (event: {target: {value: React.SetStateAction<string>}}) => {
        setUserPassword(event.target.value)
    }

    const handleSubmit = () => {
        const json = JSON.stringify({
            "firstName": userFirstName,
            "lastName": userLastName,
            "email": userEmailAddress,
            "password": userPassword
        });

        return await axios.post('https://localhost:4941/api/v1/users/register', json,)
            .then(response => {
                return response.status
            }, error => {
                return error.response.statusText
            })
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',}} />
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> <LockOutlinedIcon /> </Avatar>
                <Typography component="h1" variant="h5">Sign up to LetsTrade</Typography>
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
                                onChange={updateUserFirstName}
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
                                onChange={updateUserLastName}
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
                                onChange={updateUserEmailAddress}
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
                                onChange={updateUserPassword}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="I agree to the terms and conditions"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => {handleSubmit()}}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>

            </Container>

        </ThemeProvider>

    );
}